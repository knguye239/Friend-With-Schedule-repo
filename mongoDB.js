import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';

const router = express.Router();
const uri = "mongodb+srv://tong:123@cluster0.rp8paxo.mongodb.net/";
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
});

// Connect to the client before setting up routes
client.connect()
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch(err => console.error("Connection to MongoDB failed", err));

// Signup route using the native MongoDB client
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required" });
  }
  
  try {
    const result = await client.db('mydb').collection('users').insertOne({ username, password });
    console.log(`New user created with the following id: ${result.insertedId}`);
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Login route using the native MongoDB client
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required" });
  }
  
  try {
    const user = await client.db('mydb').collection('users').findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: "Username not found" });
    }

    if (password !== user.password) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;
