import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config()

const db = ()=>{
    return mongoose.connect(`mongodb+srv://pramodsinghthakur0591:${process.env.MONGODB_PASS}@cluster0.bhci9is.mongodb.net/BooksDb`)
}

export default db;