import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dbRouter from './mongoDB.js';
// import { db, router as dbRouter } from './database.js';
import authRoutes from './auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serving static files

// EJS view engine setup
app.set('view engine', 'ejs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

// Integrate other routes from external files
app.use(authRoutes);
app.use(dbRouter); // Use the MongoDB router

// Use the routes from database.js for mysql
// app.use(dbRouter);

// Run server
app.listen(PORT, () => {
    console.log('Server is running on port', 'localhost:', PORT);
});
