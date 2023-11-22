import axios from "axios";
import { Books } from "../model/book.js"
import Cart from '../model/cart.js';
import crypto from 'crypto';

export const getAllBooks = async(req,res)=>{
    const allBooks = await Books.find()
    res.status(200).json({response:allBooks})
}

export const findByCategory = (req,res)=>{
    const category = req.query.category.trim()
    Books.find({category:category})
    .then((result)=>{
        res.status(200).json({response:result})
    })
    .catch(err=>console.log(err))
}

export const editBook = async(req,res)=>{
    const id = req.query.id
    const uid = req.query.uid
    const newData = req.body
    console.log(req.query)
    console.log(req.body)
    const foundedBook = await Books.findOne({_id:id,uid:uid})
    foundedBook.title = newData.title
    foundedBook.authorName = newData.authorName
    foundedBook.category = newData.category
    foundedBook.bookDescription = newData.bookDescription
    foundedBook.bookPDFURL = newData.bookPDFURL
    foundedBook.price = newData.price
    foundedBook.save()
    .then((result)=>{
        res.status(200).json({response:result})
    })
    .catch(err=>console.log(err))

}

export const findBookById = (req,res)=>{
    const bookId = req.params.id
    Books.findOne({_id:bookId})
    .then((result)=>{
        res.status(200).json({response:result})
    })
    .catch(()=>{
        res.status(404).json({error:'not athorized'})
    })
}

export const addItemToCart = async(req,res)=>{
    const uid = req.body.uid
    const bookId = req.body.bookId
    const bookToAdd = await Books.findOne({_id:bookId})
    

    //if there is cart 
    try{
        const cart = await Cart.findOne({uid:uid})
    //if there is no item is array
    if(cart.items.length === 0){
        const itemToUpdate = await Cart.findOne({uid:uid})
        itemToUpdate.items = await [{item:bookToAdd,quantity:1}]
        itemToUpdate.save()
        .then(()=>{
            res.status(200).json({response:'added to cart'})
        })
        .catch(err=>console.log(err))
    }
    else{
        //if there are item in cart
        const foundedCart = await Cart.findOne({uid:uid})
        let itemToUpdate = foundedCart.items

        //checking if item already exist
        let alreadyHas = false
        foundedCart.items.forEach((i)=>{
            if(i.item._id.toString()===bookToAdd._id.toString()){
                alreadyHas = true
            }
        })
        //if item already exists
        if(alreadyHas){
            console.log('already has')
            const itemIndex = itemToUpdate.findIndex((i)=>{
                    return i.item._id.toString() === bookToAdd._id.toString()
                 })
            itemToUpdate[itemIndex].quantity += 1
            itemToUpdate[itemIndex].subTotal = itemToUpdate[itemIndex].quantity * bookToAdd.price 
            await Cart.updateOne({uid:uid},{$set:{items:[...itemToUpdate]}})
            return
        }else{
            //adding a new item if not exist
            console.log('new item')
        await Cart.updateOne({uid:uid},{$set:{items:[...itemToUpdate,{item:bookToAdd,quantity:1}]}})
        return
        }
        
    }
    }catch{
        //if there is no cart available
        Cart.create({
            uid:uid,
            items:[{item:bookToAdd,quantity:1}]
        })
        .then(()=>{
        })
        .catch(err=>console.log(err))

    }
    
    
}

export const getCartItem = async(req,res)=>{
    const uid = req.params.uid
    const cart = await Cart.findOne({uid:uid})
    res.status(200).json({response:cart?.items})
}

export const deleteItemFromCart = async(req,res)=>{
    console.log(req.body)
    const bookId = req.body.bookId
    const uid  = req.body.uid

    const cart= await Cart.findOne({uid:uid})
    let cartItems = cart.items
    const index = cartItems.findIndex((i)=>i.item._id.toString()===bookId)
    const itemToUpdate = cartItems[index]
    
    //if quantity is 1 then delete entire product
    if(itemToUpdate.quantity === 1){
        const updatedCart = cartItems.filter((i)=>i.item._id.toString()!==bookId)
        Cart.updateOne({uid:uid},{$set:{items:updatedCart}})
        .then(()=>{
            res.status(200).json({response:"ok"})
        })
        .catch(err=>console.log(err))
        
    }

    //if quantity is greater then 1 then decrese the quantity by 1
    if(itemToUpdate.quantity > 1){
        
        cartItems[index].quantity--
        Cart.updateOne({uid:uid},{$set:{items:cartItems}})
        .then(()=>{
            res.status(200).json({response:"ok"})
        })
        .catch(err=>console.log(err))

    }
    

}

export const payment  =async (req,res)=>{
    console.log(req.body)
    const salt_key = "IUHS7SYY9Y9Y943YUH2Y973Y4F934YF983"
    const merchant_id = "79298RY829Y2914G43GG3RDGGF9283RFY"

    try {
        const merchantTransactionId = req.body.transactionId;
        const data = {
            merchantId: merchant_id,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: req.body.MUID,
            name: req.body.name,
            amount: req.body.amount * 100,
            redirectUrl: `http://localhost:8080/status/${merchantTransactionId}`,
            redirectMode: 'POST',
            mobileNumber: req.body.number,
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };
        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString('base64');
        const keyIndex = 1;
        const string = payloadMain + '/pg/v1/pay' + salt_key;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;

        const prod_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"
        const options = {
            method: 'POST',
            url: prod_URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            data: {
                request: payloadMain
            }
        };

        await axios.request(options).then(function (response) {
            console.log(response.data)
            // return res.redirect(response.data.data.instrumentResponse.redirectInfo.url)
        })
        .catch(function (error) {
            console.error(error);
        });

    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false
        })
    }

    
}


