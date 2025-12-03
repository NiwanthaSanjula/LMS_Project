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

const app = express()

await connectDB()
await connectCloudinary()
app.use(cors())

// --- WEBHOOKS MUST COME BEFORE express.json() ---
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)
app.post('/clerk', express.json(), clerkWebHooks)

// JSON parsing AFTER webhooks
app.use(express.json())

// Clerk only for protected routes
app.use('/api', clerkMiddleware())

// Routes
app.use('/api/educator', educatorRouter)
app.use('/api/course', courseRouter)
app.use('/api/user', userRouter)

app.get('/', (req, res) => res.send("API Working"))

app.listen(5000, () => console.log("Server running"))
