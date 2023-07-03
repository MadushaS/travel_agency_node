const express = require('express');
const router = express.Router();
const { requiresAuth } = require('express-openid-connect');

const marketplaceController = require('../Controller/marketplaceController');
const dashboardController = require('../Controller/dashboardController');

router.get('/marketplace', marketplaceController.getMarketplace.bind({}));

router.get('/marketplace/search', marketplaceController.searchItem);

router.get('/marketplace/product/:id', marketplaceController.productInfo);

router.get('/marketplace/dashboard', requiresAuth(), dashboardController.getDashboard );
router.get('/marketplace/dashboard/profile', requiresAuth(), dashboardController.getProfile );
router.post('/marketplace/review', requiresAuth(), marketplaceController.reviewProduct );

router.get('/marketplace/add/product', requiresAuth(), (req, res) => {
  res.sendFile('add_product.html', { root: './public/dashboard' });
});

router.get('/marketplace/signin', requiresAuth(), (req, res) => {
  res.sendFile('dashboard.html', { root: './public/dashboard' });
});

router.get('/marketplace/logout', requiresAuth(), (req, res) => {
  res.redirect('/logout');
});

router.get('/marketplace/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

module.exports = router;