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

// GET /api/countries/:code
router.get('/:code', async (req, res) => {
  console.log('Route /api/countries/:code called with code:', req.params.code);
  try {
    const countryCode = req.params.code;
    let allLocations = [];
    let page = 1;
    let perPage = 100;
    let totalFetched = 0;
    let seenIds = new Set();
    let more = true;
    console.log(`Requested country code: ${countryCode}`);
    while (more && totalFetched < 500) {
      console.log(`Fetching locations from: https://api.openaq.org/v3/locations?country=${countryCode}&limit=${perPage}&page=${page}`);
      const response = await axios.get(`https://api.openaq.org/v3/locations?country=${countryCode}&limit=${perPage}&page=${page}`,
        {
          headers: {
            'X-API-Key': process.env.OPENAQ_API_KEY
          }
        }
      );
      console.log('OpenAQ API response:', JSON.stringify(response.data, null, 2));
      console.log('Raw OpenAQ locations response:', JSON.stringify(response.data, null, 2));
      const results = response.data.results || [];
      for (const loc of results) {
        if (!seenIds.has(loc.id)) {
          // Extract and deduplicate parameters from sensors array
          let parameters = [];
          if (Array.isArray(loc.sensors)) {
            const paramMap = new Map();
            loc.sensors.forEach(s => {
              if (s.parameter && (s.parameter.name || s.parameter.displayName)) {
                paramMap.set(s.parameter.id || s.parameter.name, s.parameter);
              }
            });
            parameters = Array.from(paramMap.values());
          }
          loc.parameters = parameters;
          allLocations.push(loc);
          seenIds.add(loc.id);
          totalFetched++;
        }
      }
      if (results.length < perPage) {
        more = false;
      } else {
        page++;
      }
    }
    // Debug log
    console.log(`Country code: ${countryCode}, Locations:`, allLocations.slice(0, 5).map(l => l.name || l.location));
    // Log first 3 locations' parameters arrays for inspection
    allLocations.slice(0, 3).forEach((loc, idx) => {
      console.log(`Location ${idx + 1} (${loc.name || loc.location}) parameters:`, JSON.stringify(loc.parameters, null, 2));
    });
    // Debug log: print raw locations response
    // FIX: Only use 'results' if it is defined
    if (typeof results !== 'undefined' && allLocations.length === results.length) {
      console.log(`Raw OpenAQ locations response for country ${countryCode}:`, JSON.stringify(results, null, 2));
    }
    // Print first 3 locations' parameters arrays
    allLocations.slice(0, 3).forEach((loc, idx) => {
      console.log(`Country: ${countryCode}, Location ${idx + 1} (${loc.id}, ${loc.name || loc.location}) parameters:`, JSON.stringify(loc.parameters, null, 2));
    });
    // Debug: print parameters for the first location before sending response
    if (allLocations.length > 0) {
      console.log('First location parameters:', allLocations[0].parameters);
    }
    // Debug: print the full first location object before sending response
    if (allLocations.length > 0) {
      console.log('First location object:', JSON.stringify(allLocations[0], null, 2));
    }
    res.json({ results: allLocations });
  } catch (error) {
    console.error("Error fetching locations:", error);
    if (error.response) {
      console.error("OpenAQ API error response:", error.response.data);
      res.status(error.response.status).json({ error: error.response.data.error || error.response.data || "Failed to fetch locations" });
    } else if (error.request) {
      console.error("No response from OpenAQ API", error.request);
      res.status(500).json({ error: "No response from OpenAQ API" });
    } else {
      console.error("Error setting up request:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
});

module.exports = router;


