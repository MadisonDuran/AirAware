const express = require('express');
// const { Pool } = require('pg');
const axios = require('axios');
const cors = require('cors');
const supabase = require('./supabaseClient');
require('dotenv').config();
const PORT = 4000;

const path = require('path');

const app = express();

const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
// serve the whole frontend tree at /frontend/*
app.use('/frontend', express.static(FRONTEND_DIR));

// (optional) also expose specific subfolders explicitly
app.use('/frontend/css',    express.static(path.join(FRONTEND_DIR, 'css')));
app.use('/frontend/js',     express.static(path.join(FRONTEND_DIR, 'js')));
app.use('/frontend/img',    express.static(path.join(FRONTEND_DIR, 'img')));
app.use('/frontend/html',   express.static(path.join(FRONTEND_DIR, 'html')));
app.use('/frontend/html/images', express.static(path.join(FRONTEND_DIR, 'html', 'images')));

app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, '..', 'index.html');
  res.sendFile(indexPath);
});


app.use(express.json());
// Allow both Live Server origins
const allowedOrigins = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'https://airaware-odf6.onrender.com'
];

const corsOptions = {
  origin(origin, cb) {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

// Attach CORS
app.use(cors(corsOptions));

// IMPORTANT for Express 5: handle preflight explicitly with a regex (not '*')
app.options(/.*/, cors(corsOptions));

// Test route (make sure server responds)
app.get('/api/test', (req, res) => {
res.json({ message: "API is working" });
});

const countriesRoute = require('./routes/countries');
const manufacturersRoute = require('./routes/manufacturers');
const instrumentsRoute = require('./routes/instruments');
// const submissionsRoute = require('./routes/submissions');
const search = require('./routes/search');


app.use('/api/countries', countriesRoute);
app.use('/api/manufacturers', manufacturersRoute);
app.use('/api/instruments', instrumentsRoute);
// app.use('/api/submissions', submissionsRoute);
app.use('/api/search', search);


console.log("Routes loaded: /api/test, /api/countries, /api/manufacturers, /api/instruments, /api/submissions, /api/search/{city}");

// Subscription Form  1rst API Route
app.post("/api/subscription", async (req, res) => {
  const { firstName, lastName, email, country } = req.body;

  if (!firstName||!lastName ||!email || !country) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const { data, error } = await supabase
      .from("newslettersubscription")
      .insert([
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          country: country,
        },
      ]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: "Subscription saved!", data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
app.listen(PORT, () => {
console.log(`Server running at http://localhost:${PORT}`);
});