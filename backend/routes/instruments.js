const express = require('express');
const axios = require('axios');
const router = express.Router();

// instruments route
router.get('/', async (req, res) => {
    try {
        console.log('Fetching instruments');
        const response = await axios.get('https://api.openaq.org/v3/instruments', {
            headers: {
                'X-API-Key': process.env.OPENAQ_API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching instruments:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch instruments" });
    }
});

module.exports = router;
