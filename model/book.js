import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';


const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    authorName:{
        type:String,
        required:true
    },
    imageURL:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    bookDescription:{
        type:String,
        required:true
    },
    bookPDFURL:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    user:{
        type:Object,
        required:true
    },
    uid:{
        type:String,
        required:true
    }
},{timestamps:true})

export const Books = mongoose.model('Books',bookSchema)