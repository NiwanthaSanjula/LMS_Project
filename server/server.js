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
app.use(clerkMiddleware())

//Routes
app.get('/', (req, res) => res.send("API Working"))
app.post('/clerk', express.json(), clerkWebHooks)
app.use('/api/educator', express.json(), educatorRouter)
app.use('/api/course', express.json(), courseRouter)
app.use('/api/user', express.json(), userRouter)
app.post('/stripe', express.raw({type:'application/json'}), stripeWebhooks )




//PORT
const PORT = process.env.PORT || 5000

// Only use app.listen for local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
      console.log(`server is running on http://localhost:${PORT}`);
    })
  }

// REQUIRED for Vercel: Export the Express app
export default app