const express = require('express');
const router = express.Router();

const hotelController = require('../Controller/hotelController');
const tourPackageController = require('../Controller/tourPackageController');

router.get('/', (req, res) => {
    res.sendFile('index.html', { root: './public' });
});

router.get('/about', (req, res) => {
    res.sendFile('about.html', { root: './public' });
});

router.get('/contact', (req, res) => {
    res.sendFile('contact.html', { root: './public' });
});

router.get('/flights', (req, res) => {
    res.sendFile('flights.html', { root: './public' });
});

router.get('/hotels', (req, res) => {
    res.sendFile('hotels.html', { root: './public' });
});

router.get('/hotels/book', hotelController.getHotelDetails);

router.get('/reviews', (req, res) => {
    res.sendFile('reviews.html', { root: './public' });
});

router.get('/map', (req, res) => {
    res.sendFile('map.html', { root: './public' });
});

router.get('/weather', (req, res) => {
    res.sendFile('weather.html', { root: './public' });
});

router.get('/messaging', (req, res) => {
    res.sendFile('chat.html', { root: './public' });
});

router.get('/shuttles', (req, res) => {
    res.sendFile('shuttles.html', { root: './public' });
});

router.get('/package/:name', tourPackageController.getPackage);

router.get('/explore', (req, res) => {
    res.sendFile('explore.html', { root: './public' });
});

module.exports = router;