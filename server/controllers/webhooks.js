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
        event = stripeInstance.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`); // Added return here
    }

    console.log('Webhook event received:', event.type); // Debug log

    try {
        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':{
                console.log('Processing payment_intent.succeeded');
                
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;

                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId
                })

                console.log('Session found:', session.data.length);

                if (!session.data || session.data.length === 0) {
                    console.error('No session found for payment intent:', paymentIntentId);
                    return res.status(200).json({received: true}); // Still return 200 to Stripe
                }

                const {purchaseId} = session.data[0].metadata
                console.log('Purchase ID from metadata:', purchaseId);

                const purchaseData = await Purchase.findById(purchaseId)
                
                if (!purchaseData) {
                    console.error('Purchase not found:', purchaseId);
                    return res.status(200).json({received: true});
                }

                console.log('Current purchase status:', purchaseData.status);

                const userData = await User.findById(purchaseData.userId)
                const courseData = await Course.findById(purchaseData.courseId.toString())

                if (!userData || !courseData) {
                    console.error('User or Course not found');
                    return res.status(200).json({received: true});
                }

                // Update course
                if (!courseData.enrolledStudents.includes(userData._id)) {
                    courseData.enrolledStudents.push(userData._id);
                    await courseData.save();
                    console.log('Student added to course');
                }

                // Update user
                if (!userData.enrolledCourses.includes(courseData._id)) {
                    userData.enrolledCourses.push(courseData._id);
                    await userData.save();
                    console.log('Course added to user');
                }

                // Update purchase status
                purchaseData.status = 'completed';
                await purchaseData.save();
                console.log('Purchase status updated to completed');

                break;
            }

            case 'payment_intent.payment_failed':{
                console.log('Processing payment_intent.payment_failed');
                
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;

                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId
                })

                if (!session.data || session.data.length === 0) {
                    console.error('No session found for payment intent:', paymentIntentId);
                    return res.status(200).json({received: true});
                }

                const {purchaseId} = session.data[0].metadata
                const purchaseData = await Purchase.findById(purchaseId)

                if (!purchaseData) {
                    console.error('Purchase not found:', purchaseId);
                    return res.status(200).json({received: true});
                }

                purchaseData.status = 'failed';
                await purchaseData.save();
                console.log('Purchase status updated to failed');

                break;
            }  

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.json({received: true});
        
    } catch (error) {
        console.error('Error processing webhook:', error);
        // Still return 200 to prevent Stripe from retrying
        res.status(200).json({received: true, error: error.message});
    }
}
