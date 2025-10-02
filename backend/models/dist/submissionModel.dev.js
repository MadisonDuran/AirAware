"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Define query functions with CRUD operations for submissions table
var pool = require('../config/db'); // CREATE


exports.createSubmission = function _callee(_ref) {
  var name, email, city, country_code, message, _ref2, _ref3, result, _ref4, _ref5, rows;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          name = _ref.name, email = _ref.email, city = _ref.city, country_code = _ref.country_code, message = _ref.message;
          _context.next = 3;
          return regeneratorRuntime.awrap(pool.query("INSERT INTO form_submissions (name, email, city, country_code, message) VALUES (?, ?, ?, ?, ?)", [name, email, city, country_code, message]));

        case 3:
          _ref2 = _context.sent;
          _ref3 = _slicedToArray(_ref2, 1);
          result = _ref3[0];
          _context.next = 8;
          return regeneratorRuntime.awrap(pool.query("SELECT * FROM form_submissions WHERE id = ?", [result.insertId]));

        case 8:
          _ref4 = _context.sent;
          _ref5 = _slicedToArray(_ref4, 1);
          rows = _ref5[0];
          return _context.abrupt("return", rows[0]);

        case 12:
        case "end":
          return _context.stop();
      }
    }
  });
}; // READ (all)


exports.getAll = function _callee2() {
  var limit,
      offset,
      _ref6,
      _ref7,
      rows,
      _args2 = arguments;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          limit = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : 50;
          offset = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : 0;
          _context2.next = 4;
          return regeneratorRuntime.awrap(pool.execute("SELECT * FROM form_submissions \n        ORDER BY created_at DESC\n         LIMIT ? OFFSET ?", [Number(limit), Number(offset)]));

        case 4:
          _ref6 = _context2.sent;
          _ref7 = _slicedToArray(_ref6, 1);
          rows = _ref7[0];
          return _context2.abrupt("return", rows);

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  });
}; // READ (by id)


exports.getById = function _callee3(id) {
  var _ref8, _ref9, rows;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(pool.execute("SELECT * FROM form_submissions WHERE id = ?", [id]));

        case 2:
          _ref8 = _context3.sent;
          _ref9 = _slicedToArray(_ref8, 1);
          rows = _ref9[0];
          return _context3.abrupt("return", rows[0] || null);

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
}; // UPDATE (set reviewed)


exports.setReviewed = function _callee4(id) {
  var reviewed,
      _ref10,
      _ref11,
      rows,
      _args4 = arguments;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          reviewed = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : 1;
          _context4.next = 3;
          return regeneratorRuntime.awrap(pool.execute("UPDATE form_submissions SET reviewed=? WHERE id = ?", [reviewed, id]));

        case 3:
          _context4.next = 5;
          return regeneratorRuntime.awrap(pool.execute("SELECT * FROM form_submissions WHERE id = ?", [id]));

        case 5:
          _ref10 = _context4.sent;
          _ref11 = _slicedToArray(_ref10, 1);
          rows = _ref11[0];
          return _context4.abrupt("return", rows[0] || null);

        case 9:
        case "end":
          return _context4.stop();
      }
    }
  });
}; // DELETE


exports.remove = function _callee5(id) {
  var _ref12, _ref13, result;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(pool.execute("DELETE FROM  form_submissions WHERE id = ?", [id]));

        case 2:
          _ref12 = _context5.sent;
          _ref13 = _slicedToArray(_ref12, 1);
          result = _ref13[0];
          return _context5.abrupt("return", result.affectedRows > 0);

        case 6:
        case "end":
          return _context5.stop();
      }
    }
  });
};