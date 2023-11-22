import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import {addItemToCart, deleteItemFromCart, editBook, findBookById, findByCategory, getAllBooks, getCartItem, payment} from './controllers/book.js';
import db from './utils/db.js';
import bodyParser from 'body-parser';
import { getAllAdminBooks,deleteBook,postBooks,findById } from './controllers/admin.js';


const app = express()
const PORT = process.env.PORT || 8080
app.use(helmet())
app.use(express.json())
app.use(cors({
    origin:"*"
}))
app.use(bodyParser.urlencoded({extended:true}))


app.get('/all-books',getAllBooks)
app.get('/find-by-category',findByCategory)
app.get('/find-by-id/:id',findBookById)
app.post('/add-item-to-cart',addItemToCart)
app.delete('/delete-item-from-cart',deleteItemFromCart)
app.get('/get-cart-items/:uid',getCartItem)

//admin routes
app.get('/admin/find-by-id',findById)
app.patch('/edit-book',editBook)
app.get('/admin/get-all-books/:uid',getAllAdminBooks)
app.post('/post-book',postBooks)
app.delete('/admin/delete',deleteBook)

//payment

app.post('/payment',payment)










app.listen(PORT,async()=>{
    await db()
    console.log(`server runing on port ${PORT}`)
})