"use strict";

var express = require('express');

var axios = require('axios');

var router = express.Router(); // GET /api/countries

router.get('/', function _callee(req, res) {
  var response;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log("Key being sent:", process.env.OPENAQ_API_KEY);
          _context.next = 4;
          return regeneratorRuntime.awrap(axios.get('https://api.openaq.org/v3/countries', {
            headers: {
              'X-API-Key': process.env.OPENAQ_API_KEY
            }
          }));

        case 4:
          response = _context.sent;
          res.json(response.data);
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);

          if (_context.t0.response) {
            // API responded with an error
            console.error("API error:", _context.t0.response.status, _context.t0.response.data);
            res.status(_context.t0.response.status).json(_context.t0.response.data);
          } else if (_context.t0.request) {
            // No response received
            console.error("No response from OpenAQ API");
            res.status(500).json({
              error: "No response from OpenAQ API"
            });
          } else {
            // Request setup issue  
            console.error("Error setting up request:", _context.t0.message);
            res.status(500).json({
              error: _context.t0.message
            });
          }

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
module.exports = router;