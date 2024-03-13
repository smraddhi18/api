// app.js

const express = require('express');
const taskRoute = require('./routes/taskRoutes');
const subTaskRoute = require('./routes/subTaskRoutes');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bodyParser = require('body-parser');

const app = express(); 
app.use(bodyParser.json());
const mongoose = require('mongoose');
const authenticateToken = require('./middlewares/authMiddleware'); // Import the authentication middleware
const { scheduleCronJobs } = require('./cronJob'); // Import the cron jobs

// Import middleware
// Use middleware globally
app.use(authenticateToken);
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));


// Use routes
app.use('/api/task', taskRoute);
app.use('/api/task/subtask',subTaskRoute);

scheduleCronJobs();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
