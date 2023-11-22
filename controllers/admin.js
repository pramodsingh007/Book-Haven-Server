import { Books } from "../model/book.js"

export const getAllAdminBooks = (req,res)=>{
        const uid = req.params.uid
        Books.find({uid:uid})
        .then((books)=>{
            res.status(200).json({response:books})
        })
        .catch(err=>console.log(err))
}

export const deleteBook = (req,res)=>{
    const id = req.query.id
    const uid = req.query.uid
    Books.deleteOne({_id:id,uid:uid})
    .then((result)=>{
        res.json({response:result})
    })
    .catch(err=>console.log(err))
    
}

export const postBooks = async(req,res)=>{
    const newBook = req.body
    console.log(req.body.user.uid)
    const createNewBook = await Books.create({
        title:newBook.title,
        authorName:newBook.authorName,
        imageURL:newBook.imageURL,
        category:newBook.category,
        bookDescription:newBook.bookDescription,
        bookPDFURL:newBook.bookPDFURL,
        price:newBook.price,
        user:newBook.user,
        uid:newBook.user.uid
    })
    createNewBook.save()
    .then((response)=>{
        res.status(200).json({response:response})
    })
    .catch(err=>console.log(err))
}

export const findById = (req,res)=>{
    const bookId = req.query.id
    const uid = req.query.uid

    Books.findOne({_id:bookId,uid:uid})
    .then((result)=>{
        res.status(200).json({response:result})
    })
    .catch(()=>{
        res.status(404).json({error:'not athorized'})
    })

}
