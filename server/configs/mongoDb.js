import mongoose from 'mongoose'

//Connect to the MongoDB Atlas
const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log('Database Connected✅'))

    await mongoose.connect(`${process.env.MONGODB_URI}/GreatStackLMS`)
}

export default connectDB;