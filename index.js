const express = require('express')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const cors = require('cors')

const app = express()
app.use(express.json());
app.use(cors());
const port = 5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ayah9.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("emaJohnStore").collection("products");
    const orderCollection = client.db("emaJohnStore").collection("orders");

    app.post('/addProduct', (req, res) => {
        const product = req.body
        collection.insertOne(product)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount)
            })
    })

    app.get('/products', (req, res) => {
        collection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    app.get('/product/:key', (req, res) => {
        collection.find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })

    app.post('/productByKeys', (req, res) => {
        const productKeys = req.body;
        collection.find({ key: { $in: productKeys } })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body
        orderCollection.insertOne(order)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0);
            })
    })



});

app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.listen(port)