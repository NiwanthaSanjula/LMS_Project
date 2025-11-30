import {Webhook} from 'svix'
import User from '../models/user.js'

//API controller to manage Clerk with database
export const clerkWebHooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp" : req.header["svix-timestamp"],
            "svix-signature" : req.header["svix-signature"]
        })

        const { data, type } = req.body

        switch (type) {
            case 'user.created': {
                const userData = {
                    _id : data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imgUrl : data.image_url,
                }

                await User.create(userData)
                res.json({})
                break;
            }  

            case 'user.updated': {
                const userData = {
                    email: data.email_address[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imgUrl : data.image_url,
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