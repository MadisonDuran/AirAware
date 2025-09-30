const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Route imports (make sure these files exist)
const homeRoutes = require('./routes/home');

// Load .env variables
require('dotenv').config();
console.log('Loaded API Key:', process.env.OPENAQ_API_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/home', homeRoutes);           // Home page summary

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Default root route
app.get('/', (req, res) => {
    res.send('AirAware Backend is Running');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});