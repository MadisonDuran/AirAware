console.log("Running from backend/server.js");
console.log("instruments route loaded from backend/routes/instruments.js");

const express = require('express');
<<<<<<< HEAD
const axios = require('axios');
const cors = require('cors');
=======
>>>>>>> 4d4ec89 (Revert "Route tn")
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

<<<<<<< HEAD
// Middleware
app.use(cors());
app.use(express.json());

// Test route (make sure server responds)
app.get('/api/test', (req, res) => {
res.json({ message: "API is working" });
});

const countriesRoute = require('./routes/countries');
const manufacturersRoute = require('./routes/manufacturers');
const instrumentsRoute = require('./routes/instruments');


app.use('/api/countries', countriesRoute);
app.use('/api/manufacturers', manufacturersRoute);
app.use('/api/instruments', instrumentsRoute);

console.log("Routes loaded: /api/test, /api/countries, /api/manufacturers, /api/instruments");

// Start server
=======
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!'});
});

>>>>>>> 4d4ec89 (Revert "Route tn")
app.listen(PORT, () => {
console.log(`Server running at http://localhost:${PORT}`);
});