import Stripe from "stripe"
import Course from "../models/course.js"
import User from "../models/user.js"
import { Purchase } from "../models/purchase.js"




//Get user data
export const getUserData = async (req, res) => {
    try {
        const userId = req.auth.userId
        const user = await User.findById(userId)

        if (!user) {
            return res.json({success: false , message:  'User not found!'})
        }

        res.json({success: true, user})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    
    }
}


//Users Enrolled Courses with Lecture Links
export const userEnrolledCourses = async (req, res) => {
    try {
        const userId = req.auth.userId
        const userData = await User.findById(userId).populate('enrolledCourses')

        if (!userData) {
            return res.json({success: false , message:  'No Enrolled Courses Found!'})
            
        }

        res.json({ success: true, enrolledCourses: userData.enrolledCourses })
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//purchase course
export const purchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.body
        const { origin } = req.headers
        const userId = req.auth.userId

        const userData = await User.findById(userId)
        const courseData = await Course.findById(courseId)

        if (!userData || !courseData) {
            return res.json({success: false , message:  'No User or Courses Found!'})  
        }

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)
        }

        const newPurchase = await Purchase.create(purchaseData);


        //Init Stripe gateway
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
        const currency = process.env.CURRENCY.toLowerCase();

        //creating line items
        const line_items = [{
            price_data : {
                currency,
                product_data:{
                    name: courseData.courseTitle
                },
                unit_amount: Math.floor(newPurchase.amount) * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                purchaseId: newPurchase._id.toString()
            }
        })
        res.json({success: true, session_url: session.url })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}
