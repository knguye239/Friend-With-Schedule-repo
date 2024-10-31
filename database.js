import mysql2 from 'mysql2';
import express from 'express';
const router = express.Router();

// conncect with database
const db = mysql2.createPool({
    connectionLimit : 10,
    host     : '192.168.50.20',
    user     : 'root',
    password : 'root',
    database : 'db_login'
});

// when setup remote database the following method:

// sign up
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
router.post('/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if (!username) {
        res.status(400).json({ success: false, message: "Username is required!" });
        return;
    }

    // Hash the password before saving
    // bcrypt.hash(password1, saltRounds, (err, hashedPassword) => {
    //     if (err) {
    //         console.error(err);
    //         res.status(500).json({ success: false, message: "Server Error" });
    //         return;
    //     }

        // Insert user into the database
        db.query("INSERT INTO `user` (`username`, `password`) VALUES (?, ?)", [username, password], (err, result) => {
            if (err) {
                console.error("Error inserting into MySQL: ", err.stack);
                res.status(500).json({ success: false, message: "Server Error" });
                return;
            }
            res.json({ success: true });
        });
    //});
});

// login
router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // console.log(req.body.username);

    db.query("SELECT * FROM `user` WHERE `username` = ?", [username], (err, result) => {
        if (err) {
            console.error("Error querying MySQL: ", err.stack);
            res.status(500).json({ success: false, message: "Server Error" });
            return;
        }

        if (result.length === 0) {
            res.json({ success: false, message: "Username not found" });
            return;
        }

        const user = result[0];
        // Here you would check if the password matches, possibly using bcrypt.compare if you hashed the password during signup
        if (password !== user.password) {
            res.json({ success: false, message: "Incorrect password" });
            return;
        }

        res.json({ success: true });
    });
});

// database connection
db.getConnection((err, connection) => {
    if(err) {
        console.error("Error connecting to MySQL: ", err.stack);
        return;
    }
    console.log("Connected to MySQL as ID " + connection.threadId);
    connection.release();
  });

// check username
async function findUserByUsername(username) {
    let connection;
    try {
      connection = await pool.getConnection();
      
      const [rows] = await connection.execute('SELECT * FROM `user` WHERE `username` = ?', [username]);
      
      if (rows.length === 0) {
        return null; // User not found
      }
  
      return rows[0]; // Return the user record
    } catch (error) {
      throw error; // Rethrow the error to be handled by the caller
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }  

router.post('/check-username', async (req, res) => {
    const username = req.body.username;

    try {
        // Assuming you are using a database function named 'findUserByUsername'
        const user = await findUserByUsername(username);
        if (user) {
            res.json({ available: false });
        } else {
            res.json({ available: true });
        }
    } catch (error) {
        res.status(500).json({ available: false, message: "Server error" });
    }
});

export { db, router };
