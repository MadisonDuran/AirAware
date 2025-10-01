console.log("Running from backend/server.js");
console.log("instruments route loaded from backend/routes/instruments.js");

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const searchRoutes = require('./routes/search');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/search', searchRoutes);

// Test route (make sure server responds)
app.get('/api/test', (req, res) => {
res.json({ message: "API is working" });
});

const countriesRoute = require('./routes/countries');
const manufacturersRoute = require('./routes/manufacturers');
const instrumentsRoute = require('./routes/instruments');
const submissionsRoute = require('./routes/submissions');


app.use('/api/countries', countriesRoute);
app.use('/api/manufacturers', manufacturersRoute);
app.use('/api/instruments', instrumentsRoute);
app.use('/api/submissions', submissionsRoute);

console.log("Routes loaded: /api/test, /api/countries, /api/manufacturers, /api/instruments, /api/submissions");

// Start server
app.listen(PORT, () => {
console.log(`Server running at http://localhost:${PORT}`);
});

app.post('/api/test', (req, res) => res.json({ ok: true }));

