const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const { initializeDatabase } = require('./db');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Start server after database is ready
const startServer = async () => {
    console.log('🚀 Initializing database...');
    
    // This will create DB + tables automatically!
    const pool = await initializeDatabase();
    
    if (!pool) {
        console.error('❌ Database initialization failed. Exiting...');
        process.exit(1);
    }

    // Make pool available to routes
    app.locals.db = pool;

    // API Routes
    app.use('/api/tasks', taskRoutes);

    // Serve frontend for any other route
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/index.html'));
    });

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`💾 Database: ${process.env.DB_NAME} on ${process.env.DB_HOST}`);
    });
};

startServer();