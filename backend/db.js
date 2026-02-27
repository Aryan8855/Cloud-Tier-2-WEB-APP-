const mysql = require('mysql2/promise');
require('dotenv').config();

// Initial connection WITHOUT database (to create DB if needed)
const initDatabase = async () => {
    try {
        // Connect to MySQL server without specifying a database
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT || 3306
        });

        console.log('✅ Connected to MySQL server');
        
        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
        console.log(`📁 Database '${process.env.DB_NAME}' created or already exists`);
        
        await connection.end();
        return true;
    } catch (error) {
        console.error('❌ Failed to create database:', error.message);
        return false;
    }
};

// Create connection pool for actual app usage
const createPool = () => {
    return mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true
    });
};

// Create tables if they don't exist
const createTables = async (pool) => {
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                status ENUM('pending', 'completed') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `;
        
        await pool.query(createTableQuery);
        console.log('📊 Table "tasks" created or already exists');
        
        // Optional: Insert sample data if table was just created
        const [rows] = await pool.query('SELECT COUNT(*) as count FROM tasks');
        if (rows[0].count === 0) {
            await pool.query(`
                INSERT INTO tasks (title, status) VALUES 
                ('Complete project documentation', 'pending'),
                ('Review pull requests', 'completed'),
                ('Setup AWS RDS connection', 'pending')
            `);
            console.log('📝 Sample data inserted');
        }
        
        return true;
    } catch (error) {
        console.error('❌ Failed to create tables:', error.message);
        return false;
    }
};

// Main initialization function
const initializeDatabase = async () => {
    // Step 1: Create database if needed
    const dbCreated = await initDatabase();
    if (!dbCreated) return null;
    
    // Step 2: Create connection pool
    const pool = createPool();
    
    // Step 3: Create tables
    const tablesCreated = await createTables(pool);
    if (!tablesCreated) return null;
    
    console.log('✅ Database initialization complete!');
    return pool;
};

module.exports = { initializeDatabase };