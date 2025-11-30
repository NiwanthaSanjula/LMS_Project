import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongoDb.js'
import { clerkWebHooks } from './controllers/webhooks.js'

//init express
const app = express()

//connect to database
await connectDB()

//middleware
app.use(cors())

// IMPORTANT: Webhook route BEFORE express.json() - needs raw body
app.post('/clerk', 
    express.raw({ type: 'application/json' }), 
    clerkWebHooks
)

// Regular JSON parsing for other routes
app.use(express.json())

//Routes
app.get('/', (req, res) => res.send("API Working"))


//PORT
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
})

