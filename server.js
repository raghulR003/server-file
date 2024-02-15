const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors'); // Import the cors middleware

const app = express();
const port = 5020;

app.use(cors()); // Enable CORS for all routes

const corsOptions = {
  origin: 'https://admin-monitoring-4f918.web.app',
};

app.use(cors(corsOptions));

// MongoDB Atlas connection URI
const uri = 'mongodb+srv://user1:root@initialload.qj5mr8z.mongodb.net/joborr-db?retryWrites=true&w=majority';

// Database and collection names
const dbName = 'joborr-db';
const collectionName = 'userdat';

app.get('/', async (req, res) => {
  try {
    // Connect to MongoDB Atlas
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    // Access the specified database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Fetch all documents from the collection
    const documents = await collection.find({}).toArray();

    // Close the connection
    await client.close();

    // Send the fetched documents as JSON response
    res.json(documents);
  } catch (err) {
    console.error('Error fetching documents:', err);
    res.status(500).send('Error fetching documents');
  }
});
app.use(express.json());
app.post('/', async (req, res) => {
  try {
    // Connect to MongoDB
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    // Access the specified database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Parse the request body as JSON
    const message = req.body;

    // Insert the message into the collection
    await collection.insertOne(message);

    // Close the connection
    await client.close();

    // Send success response
    res.status(201).send('Message sent successfully');
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).send('Error sending message');
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = app;
