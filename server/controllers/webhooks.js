import { Webhook } from 'svix'
import Stripe from "stripe"
import User from '../models/user.js'
import { Purchase } from '../models/purchase.js'
import Course from '../models/course.js'

//API controller to manage Clerk with database
export const clerkWebHooks = async (req, res) => {
    console.log("webhooks hits")

    try {
        console.log("Webhook body:", req.body)
        
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp" : req.headers["svix-timestamp"],
            "svix-signature" : req.headers["svix-signature"]
        })

        const { data, type } = req.body

        switch (type) {
            case 'user.created': {
                const userData = {
                    _id : data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl : data.image_url,
                }

                await User.create(userData)
                res.json({})
                break;
            }  

            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl : data.image_url,
                }
                await User.findByIdAndUpdate(data.id, userData) //possible error.should be _.id
                res.json({})
                break;
            } 

            case 'user.deleted': {
                await User.findByIdAndDelete(data.id) //possible error.should be _.id
                res.json({})
                break;
            }     
            
            default:
                break;
        }

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})

        
    }
}

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = Stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    // -----------------------------
    // SUCCESS EVENT FROM CHECKOUT
    // -----------------------------
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        const purchaseId = session.metadata.purchaseId;
        if (!purchaseId) {
            console.log("No purchaseId in metadata");
            return res.json({ received: true });
        }

        const purchaseData = await Purchase.findById(purchaseId);
        const userData = await User.findById(purchaseData.userId);
        const courseData = await Course.findById(purchaseData.courseId);

        // Update course
        courseData.enrolledStudents.push(userData._id);
        await courseData.save();

        // Update user
        userData.enrolledCourses.push(courseData._id);
        await userData.save();

        // Update purchase status
        purchaseData.status = "completed";
        await purchaseData.save();

        console.log("Purchase updated to COMPLETED:", purchaseId);
    }

    // -----------------------------
    // FAILURE EVENT
    // -----------------------------
    if (event.type === "payment_intent.payment_failed") {
        const intent = event.data.object;

        // Look up session from payment intent
        const sessions = await stripe.checkout.sessions.list({
            payment_intent: intent.id,
        });

        const purchaseId = sessions.data[0]?.metadata?.purchaseId;
        if (purchaseId) {
            const purchaseData = await Purchase.findById(purchaseId);
            purchaseData.status = "failed";
            await purchaseData.save();
            console.log("Purchase updated to FAILED:", purchaseId);
        }
    }

    // Return a response to acknowledge receipt of the event
    response.json({received: true});
}
