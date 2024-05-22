const express = require('express');
const app = express();
require('dotenv').config();
const Transaction = require('./models/Transaction.js')
const cors = require('cors');
const { default: mongoose } = require('mongoose');

app.use(cors());

const dbURI = process.env.MONGO_URL;

app.use(express.json());

app.get('/', (req, res) => {
  res.json('Hello World!');
});

mongoose.connect(dbURI, {

  })
  .then(() => {
    console.log('MongoDB connected');
    // Start the server after successful connection
    app.listen(6200, () => {
      console.log('Server is running on port 6200');
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Define your routes
app.post('/api/transaction', async (req, res) => {
    try {
      const { name, description, datetime, price } = req.body;
      const transaction = await Transaction.create({ name, description, datetime, price });
      res.json(transaction);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  app.get('/api/transactions',async(req,res) => {
    const transactions = await Transaction.find()
    res.json(transactions);
  })