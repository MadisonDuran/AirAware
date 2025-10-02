"use strict";

console.log("Running from backend/server.js");
console.log("instruments route loaded from backend/routes/instruments.js");

var express = require('express');

var axios = require('axios');

var cors = require('cors');

require('dotenv').config();

var app = express();
app.use(cors());
app.use(express.json()); // Test route (make sure server responds)

app.get('/api/test', function (req, res) {
  res.json({
    message: "API is working"
  });
});

var countriesRoute = require('./routes/countries');

var manufacturersRoute = require('./routes/manufacturers');

var instrumentsRoute = require('./routes/instruments');

var submissionsRoute = require('./routes/submissions');

app.use('/api/countries', countriesRoute);
app.use('/api/manufacturers', manufacturersRoute);
app.use('/api/instruments', instrumentsRoute);
app.use('/api/submissions', submissionsRoute);
console.log("Routes loaded: /api/test, /api/countries, /api/manufacturers, /api/instruments, /api/submissions"); // Start server

var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log("Server running at http://localhost:".concat(PORT));
});
app.post('/api/test', function (req, res) {
  return res.json({
    ok: true
  });
});