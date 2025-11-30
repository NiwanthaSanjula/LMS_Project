import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongoDb.js'

//init express
const app = express()

//connect to database
await connectDB()

//middleware
app.use(cors())

//Routes
app.get('/', (req, res) => res.send("API Working"))

//PORT
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
})

