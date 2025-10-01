const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET /api/countries
router.get('/', async (req, res) => {
try {
    console.log("Key being sent:", process.env.OPENAQ_API_KEY);
const response = await axios.get('https://api.openaq.org/v3/countries', {
headers: {
'X-API-Key': process.env.OPENAQ_API_KEY
}
});

res.json(response.data);

} catch (error) {
if (error.response) {
// API responded with an error
console.error("API error:", error.response.status, error.response.data);
res.status(error.response.status).json(error.response.data);
} else if (error.request) {
// No response received
console.error("No response from OpenAQ API");
res.status(500).json({ error: "No response from OpenAQ API" });
} else {
// Request setup issue  
console.error("Error setting up request:", error.message);
res.status(500).json({ error: error.message });
}
}
});

module.exports = router;


