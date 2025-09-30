const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!'});
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});