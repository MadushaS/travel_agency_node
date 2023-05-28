const express = require('express');
const router = express.Router();
const { requiresAuth } = require('express-openid-connect');

router.get('/marketplace', (req, res) => {
    res.sendFile('marketplace.html', { root: './public/dashboard' });
  });

router.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
  });

module.exports = router;