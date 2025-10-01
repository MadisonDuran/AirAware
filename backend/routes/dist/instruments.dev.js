"use strict";

var express = require('express');

var axios = require('axios');

var router = express.Router(); // instruments route

router.get('/', function _callee(req, res) {
  var response;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log('Fetching instruments');
          _context.next = 4;
          return regeneratorRuntime.awrap(axios.get('https://api.openaq.org/v3/instruments', {
            headers: {
              'X-API-Key': process.env.OPENAQ_API_KEY
            }
          }));

        case 4:
          response = _context.sent;
          res.json(response.data);
          _context.next = 10;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
module.exports = router;