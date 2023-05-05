const express = require('express');
const router = express.Router();
const FileSystem = require('fs');

router.get('/destinations/:city', (req, res) => {
    const city = req.params.city.toLowerCase();
    if (FileSystem.existsSync(`./public/destinations/${city}.html`)) {
        res.sendFile(`${city}.html`, { root: './public/destinations' });
    }
    else {
        res.sendFile(`not_found.html`, { root: './public/destinations' });
    }
});

module.exports = router;