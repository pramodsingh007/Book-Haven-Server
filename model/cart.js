import mongoose from "mongoose";


const cartSchema = new mongoose.Schema({
    uid:{
        type:String,
        required:true,
        unique:true
    },
    items:{
        type:Array,
        required:true
    }
},{timestamps:true})

const Cart = mongoose.model('Cart',cartSchema)


export default Cart