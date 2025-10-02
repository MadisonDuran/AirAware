const express = require('express');
const m = require('../models/submissionModel');
const router = express.Router();


const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || '');
const clip = (s, n) => (s ?? '').toString().trim().slice(0, n);


// CREATE
router.post('/', async (req, res) => {
  try {
      let { name, email, city, country_code, message } = req.body || {};
      name = clip(name, 100);
      email = clip(email, 255);
      city = clip(city,120);
      country_code = (clip(country_code, 2) || '').toUpperCase() || null;
      message = clip(message, 500) || null;




      if (!name) return res.status(400).json({ error: 'name is required'});
      if (!email || !isEmail(email)) return res.status(400).json({ error: 'valid email is required'});




      const row = await m.createSubmission({ name, email, city, country_code, message});
      res.status(201).json(row);
  } catch (e) {
      console.error('create failed:', e);
      res.status(500).json({ error: 'create failed'});
  }
  console.log('POST /api/submissions body:', req.body);
});



// READ (all)
router.get('/', async (req, res) => {
  try {
      const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
      const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);
      const rows = await m.getAll({ limit, offset });
      res.json(rows);
  } catch (e) {
      console.log('read all failed:', e);
      res.status(500).json({ error: 'read all failed' });
  }
});


// READ (by id)
router.get('/:id', async (req, res) => {
  try {
      const row = await m.readById(parseInt(req.params.id, 10));
      if (!row) return res.status(404).json({ error: 'not found' });
      res.json(row);
  } catch (e) {
      console.error('read by id failed:', e);
      res.status(500).json({ error: 'read by id failed' });
  }
});


// UPDATE
router.patch('/:id/reviewed', async (req, res) => {
  try {
      const reviewed = req.body?.reviewed === false ? 0 : 1;
      const result = await m.updateReviewed(parseInt(req.params.id, 10), reviewed);
      res.json(result);
  } catch (e) {
      console.error('update failed:', e);
      res.status(500).json({ error: 'update failed' });
  }
});


// DELETE
router.delete('/:id', async (req, res) => {
  try {
      const ok = await m.remove(parseInt(req.params.id, 10));
      if (!ok) return res.status(404).json({ error: 'not found' });
      res.status(204).end();
  } catch (e) {
      console.error('delete failed:', e);
      res.status(500).json({ error: 'delete failed' });
  }
})


module.exports = router;