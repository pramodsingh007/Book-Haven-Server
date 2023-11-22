import mongoose from 'mongoose';


const ordersSchema = mongoose.Schema({
    user:{
        type:Object,
        required:true
    },
    items:{
        type:Array,
        required:true
    },

},{timestamps:true})

const Order = mongoose.model(Orders,ordersSchema)

export default Order