const express = require('express');
// const { Pool } = require('pg');
const axios = require('axios');
const cors = require('cors');
const supabase = require('./supabaseClient');
require('dotenv').config();
const PORT = 4000;


const app = express();

// // PostgreSQL connection setup
// const pool = new Pool({
//   connectionString: process.env.POSTGRES_URL + "?sslmode=require",
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

app.use(express.json());
// Allow both Live Server origins
const allowedOrigins = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',
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


app.use('/api/countries', countriesRoute);
app.use('/api/manufacturers', manufacturersRoute);
app.use('/api/instruments', instrumentsRoute);
// app.use('/api/submissions', submissionsRoute);

console.log("Routes loaded: /api/test, /api/countries, /api/manufacturers, /api/instruments, /api/submissions");

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