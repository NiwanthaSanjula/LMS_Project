import {Webhook} from 'svix'
import User from '../models/user.js'

//API controller to manage Clerk with database
export const clerkWebHooks = async (req, res) => {
    console.log("webhook hits");
    
    try {
        // Convert raw buffer to string
        const payloadString = req.body.toString()

        // Log to verify webhook is being hit
        console.log("✅ Webhook received!")
        console.log("Headers:", req.headers)
        
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

         // Verify the webhook
        const payload = whook.verify(payloadString, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp" : req.headers["svix-timestamp"],
            "svix-signature" : req.headers["svix-signature"]
        })

        console.log("✅ Webhook verified!")
        console.log("Event type:", payload.type)

        const { data, type } = payload

        switch (type) {
            case 'user.created': {
                console.log("Creating user:", data.id)

                const userData = {
                    _id : data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl : data.image_url,
                }

                const newUser = await User.create(userData)
                console.log("✅ User created in DB:", newUser._id)

                res.json({success: true})
                break;
            }  

            case 'user.updated': {
                console.log("Updating user:", data.id)
                
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl : data.image_url,
                }
                await User.findByIdAndUpdate(data.id, userData) 
                console.log("✅ User updated in DB")

                res.json({success: true})
                break;
            } 

            case 'user.deleted': {
                console.log("Deleting user:", data.id)

                await User.findByIdAndDelete(data.id)
                console.log("✅ User deleted from DB")

                res.json({success: true})
                break;
            }     
            
            default:
                console.log("Unknown event type:", type)
                res.json({ success: true })
                break;
        }

    } catch (error) {
        console.error("❌ Webhook error:", error.message)
        console.error("Full error:", error)
        res.status(400).json({ success: false, message: error.message })
        
    }
}