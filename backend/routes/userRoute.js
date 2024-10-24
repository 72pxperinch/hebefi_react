import express from 'express';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import { getToken, isAuth } from '../util.js';

const router = express.Router();

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'hebefi', // Replace with your actual database name
};

const pool = mysql.createPool(dbConfig);

router.put('/:id', isAuth, async (req, res) => {
  const userId = req.params.id;
  const userData = req.body;

  let connection;
  try {
    connection = await pool.getConnection();

    // Update user data in the Users table
    const [updateUserResult] = await connection.execute(
      'UPDATE Users SET username = ?, email = ?, password_hash = ? WHERE user_id = ?',
      [userData.name, userData.email, userData.password, userId]
    );

    if (updateUserResult.affectedRows > 0) {
      res.send({ message: 'User Updated' });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

router.post('/signin', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let connection;
  try {
    connection = await pool.getConnection();

    // Retrieve user by email
    const [results] = await connection.execute('SELECT * FROM Users WHERE email = ?', [email]);
    if (results.length === 1) {
      const user = results[0];

      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (passwordMatch) {
        res.send({
          _id: user.user_id,
          name: user.username,
          email: user.email,
          isAdmin: user.is_admin,
          token: getToken(user),
        })
        console.log(getToken(user));
      } else {
        res.status(401).send({ message: 'Invalid Email or Password.' });
      }
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

router.post('/register', async (req, res) => {
  const userData = req.body;

  let connection;
  try {
    connection = await pool.getConnection();

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Insert the new user into the Users table
    const [insertUserResult] = await connection.execute(
      'INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)',
      [userData.name, userData.email, hashedPassword]
    );

    if (insertUserResult.insertId) {
      res.send({
        _id: insertUserResult.insertId,
        name: userData.name,
        email: userData.email,
        isAdmin: false,
        token: getToken(userData),
      });
    } else {
      res.status(401).send({ message: 'Invalid User Data.' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

router.get('/createadmin', async (req, res) => {
  console.log("Triggered");
  let connection;
  try {
    connection = await pool.getConnection();

    // Hash the admin's password before saving it
    const hashedPassword = await bcrypt.hash('1234', 10);

    // Insert an admin user into the Users table
    const [insertUserResult] = await connection.execute(
      'INSERT INTO Users (username, email, password_hash, is_admin) VALUES (?, ?, ?, ?)',
      ['Hafidh', 'admin@example.com', hashedPassword, true]
    );

    if (insertUserResult.insertId) {
      res.send({ message: 'Admin User Created' });
    } else {
      res.status(401).send({ message: 'Error creating admin user.' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

export default router;
