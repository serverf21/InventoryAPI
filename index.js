
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = 'mongodb://localhost/inventoryAPI';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log("MongoDB connection failed: ", err);
    });

const productSchema = new mongoose.Schema({
    id: Number,
    name: String,
    quantity: Number,
});

const Product = mongoose.model('Product', productSchema);

app.get('/', async (req, res) => {
    res.json({ message: "Use /getproducts, /addproducts" })
});

app.get('/getproducts', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

app.post('/addproducts', async (req, res) => {
    const product = await Product.create({
        id: req.query.id,
        name: req.query.name,
        quantity: req.query.quantity,
    });
    await product.save();
    res.json(product);
});

app.put('/updateproducts/:id', async (req, res) => {

    const product = await Product.findOneAndUpdate({ _id: req.query.id }, { quantity: req.query.quantity }, { new: true });
    res.json(product);
});

app.delete('/deleteproducts/:id', async (req, res) => {
    const del = await Product.findByIdAndRemove({ _id: req.query.id });
    res.json({ message: 'Product deleted' });
});

const port = 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});