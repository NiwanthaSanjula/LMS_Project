import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { clerkMiddleware } from '@clerk/express'
import connectDB from './configs/mongoDb.js'
import { clerkWebHooks, stripeWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoute.js'
import connectCloudinary from './configs/cloudinary.js'
import courseRouter from './routes/courseRoute.js'
import userRouter from './routes/userRoutes.js'

//init express
const app = express()

//connect to database
await connectDB()
await connectCloudinary()

//middleware
app.use(cors())

// IMPORTANT: Webhook routes MUST come BEFORE express.json() and other middleware
// Stripe needs the raw body for signature verification
app.post('/stripe', express.raw({type:'application/json'}), stripeWebhooks)
app.post('/clerk', express.json(), clerkWebHooks)

// Now apply other middleware
app.use(express.json())
app.use(clerkMiddleware())

//Routes
app.get('/', (req, res) => res.send("API Working"))
app.use('/api/educator', educatorRouter)
app.use('/api/course', courseRouter)
app.use('/api/user', userRouter)

//PORT
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
})