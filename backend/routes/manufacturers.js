const express = require('express');
const axios = require('axios');
const router = express.Router();


// Manufacturers route
router.get('/', async (req, res) => {
    try {
        console.log("Fetching manufacturers");
        const response = await axios.get(`https://api.openaq.org/v3/manufacturers`, {
            headers: {
                'X-API-Key': process.env.OPENAQ_API_KEY
            }
        });
        console.log("Manufacturers fetched:", response.data);
        res.json(response.data);
    } catch (error) {
        console.error("Manufacturers API error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch manufacturers" });
    }
});

module.exports = router;
