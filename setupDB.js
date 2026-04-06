const mysql = require('mysql2/promise');
require('dotenv').config();
const bcrypt = require('bcrypt');

async function setupDatabase() {
  try {
    const connectionOptions = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 3306,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : null,
    };

    // If a database is specified, include it in the connection. 
    // Cloud providers usually give you a database and don't allow "CREATE DATABASE"
    if (process.env.DB_NAME) {
      connectionOptions.database = process.env.DB_NAME;
    }

    const connection = await mysql.createConnection(connectionOptions);

    if (!process.env.DB_NAME) {
      console.log('No database specified in .env. Attempting to create "vcet_erp"...');
      await connection.query('CREATE DATABASE IF NOT EXISTS `vcet_erp`;');
      await connection.changeUser({ database: 'vcet_erp' });
    } else {
      console.log(`Connected to database: ${process.env.DB_NAME}`);
    }

    console.log('Creating users table if not exists...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) UNIQUE,
        password VARCHAR(255)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Check if the demo user already exists
    const [rows] = await connection.query('SELECT id FROM users WHERE email = ?', ['admin@vcet.edu.in']);
    
    if (rows.length === 0) {
      console.log('Inserting sample user: admin@vcet.edu.in / password123');
      const samplePassword = 'password123';
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(samplePassword, saltRounds);

      await connection.query(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        ['admin@vcet.edu.in', hashedPassword]
      );
      console.log('Sample user created successfully.');
    } else {
      console.log('Sample user already exists in the database.');
    }

    console.log('Database setup complete.');
    await connection.end();

  } catch (error) {
    console.error('Error setting up the database:', error);
  }
}

setupDatabase();
