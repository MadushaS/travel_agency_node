const express = require('express');
const router = express.Router();

router.get('/destinations/galle', (req, res) => {
    res.sendFile('galle.html', { root: './public/destinations' });
});

module.exports = router;