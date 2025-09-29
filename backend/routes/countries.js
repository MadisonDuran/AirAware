const express = require('express');
const axios = require('axios');
const router = express.Router();

// Countries route
router.get('/', async (req, res) => {
try {
const response = await axios.get('https://api.openaq.org/v3/countries', {
headers: {
'X-API-Key': process.env.OPENAQ_API_KEY
}
});
res.json(response.data);
} catch (error) {
console.error("Error fetching countries:", error.response?.data || error.message);
res.status(500).json({ error: "Failed to fetch countries" });
}
});

module.exports = router;

