const express = require('express');
const router = express.Router();
const cors = require('cors');

const airportController = require('../Controller/airportController');
const contactFormController = require('../Controller/contactFormController');
const scheduleController = require('../Controller/scheduleController');
const flightRouteController = require('../Controller/flightRouteController');
const flightReservationController = require('../Controller/flightReservationController');
const hotelController = require('../Controller/hotelController');
const weatherController = require('../Controller/weatherController');
const chatController = require('../Controller/chatController');
const shuttleController = require('../Controller/shuttleController');

corsConfig={
    origin: ['http://localhost:3000', 'https://nayana.onrender.com/']
  };

// Contact form submission
router.post('/api/contact', contactFormController.contactFormSubmit);

// Get airports
router.get('/api/flight/airports/:country',cors(corsConfig), airportController.getAirportsByCountry)

// Search schedules
router.post('/api/flight/schedules',cors(corsConfig), scheduleController.searchSchedule);

// Confirm flight reservation
router.post('/api/flight/reservations',cors(corsConfig), flightReservationController.confirmReservation);

// Get flight route map
router.get('/api/flight/route/image',cors(corsConfig), flightRouteController.getflightRouteMap);

// Get hotels
router.get('/api/hotels/:location/:showRestaurants/:rating',cors(corsConfig), hotelController.getHotels);

// Book a hotel
router.post('/api/hotels/book',cors(corsConfig), hotelController.bookHotel);

// Get weather by city
router.get('/api/weather/:city',cors(corsConfig), weatherController.getWeatherByCity);

// Get weather by coordinates
router.get('/api/weather/:lat/:lon',cors(corsConfig), weatherController.getWeatherByCoordinates);

// Chat
router.post('/api/chat',cors(corsConfig), chatController.chat);

// Confirm shuttle reservation
router.post('/api/shuttle/bookings',cors(corsConfig), shuttleController.confirmReservation);

module.exports = router;