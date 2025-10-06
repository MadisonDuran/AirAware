const express = require('express');
const router = express.Router();
const { getCityWeather } = require('../controllers/resultController');

// GET /api/search/:city
router.get('/:city', getCityWeather);

module.exports = router;