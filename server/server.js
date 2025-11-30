import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { clerkMiddleware } from '@clerk/express'
import connectDB from './configs/mongoDb.js'
import { clerkWebHooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoute.js'

//init express
const app = express()

//connect to database
await connectDB()

//middleware
app.use(cors())
app.use(clerkMiddleware())

//Routes
app.get('/', (req, res) => res.send("API Working"))
app.post('/clerk', express.json(), clerkWebHooks)
app.use('/api/educator', express.json(), educatorRouter)

//PORT
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
})

