

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { testConnection } = require('./config/database');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Test database connection
testConnection();

// Import and use routes
app.use('/api/tasks', require('./api/routes/taskRoutes'));
app.use('/api/scheduler', require('./api/routes/schedulerRoutes'));

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Task Scheduler API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

module.exports = app;