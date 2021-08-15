const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zzdks.mongodb.net/ArabicHotel?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const port = process.env.PORT || 4500;



const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}))


app.get('/', (req, res) => {
  res.send('Hello World!')
})



client.connect(err => {
    const allBooksCollection = client.db("uoomdahBookShop").collection("AllBooks");
    const booksUsersCollection = client.db("uoomdahBookShop").collection("booksUser");
    console.log('database connection established');

    app.post('/allBooksAdd', (req, res) => {
         const allBooksAdd = req.body;
         allBooksCollection.insertMany(allBooksAdd)
         .then((result) =>{
             res.send(result.insertedCount)
         })
    })


    app.get('/showAllBooks', (req, res) => {
        allBooksCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

    app.get('/addToCart/:key', (req, res) => {
        const addToCart = req.params.key;
        allBooksCollection.find({key: addToCart})
        .toArray((err, documents) => {
            res.send(documents[0])
        })
    })


    app.post('/addNewUsers',(req, res) =>{
        const addNewUsers = req.body;
        booksUsersCollection.insertOne(addNewUsers)
        .then(result =>{
            res.send(result.insertedCount)
        })
    })


    app.get('/showUsersList',(req, res) =>{
        booksUsersCollection.find({email: req.query.email})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })


    app.post('/addNewBooks',(req, res) =>{
        const addNewBook = req.body;
        console.log(addNewBook);
        allBooksCollection.insertOne(addNewBook)
        .then((result) =>{
            res.send(result.insertedCount)
        })
    })


    app.delete('/deleteBook/:id', (req, res) =>{
        console.log(req.params.id);
        allBooksCollection.deleteOne({key: req.params.id})
        .then((result) =>{
            console.log(result)
        })
    })


})

app.listen(port)