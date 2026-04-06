require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : null,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Utility: Check if connected
pool.getConnection()
  .then(conn => {
    console.log('Successfully connected to the MySQL database.');
    conn.release();
  })
  .catch(err => {
    console.error('Failed to connect to MySQL database:', err.message);
    console.error('Tip: Ensure MySQL is running and the credentials in .env are correct. Try running "node setupDB.js" first.');
  });

// --- API ROUTES ---

// POST /login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  // Domain validation
  if (!email.endsWith('@vcet.edu.in')) {
    return res.status(403).json({ success: false, message: 'Access denied. Only @vcet.edu.in emails are allowed.' });
  }

  try {
    // Check if user exists
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const user = rows[0];

    // Compare passwords using bcrypt
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
    }

    // Success response
    return res.status(200).json({ 
      success: true, 
      message: 'Login successful', 
      user: { id: user.id, email: user.email } 
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`ERP Backend server running on http://localhost:${PORT}`);
});
