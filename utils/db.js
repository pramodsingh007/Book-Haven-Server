import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config()

const db = ()=>{
    return mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASS}@cluster0.bhci9is.mongodb.net/BooksDb`)
}

export default db;