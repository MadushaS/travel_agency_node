const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const cors = require('cors');

const multConfig = multer.diskStorage({
  destination: 'public/images/products/',
  limits: {
    fileSize: 10000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error('Please upload an image'));
    }
    cb(undefined, true);
  },
  filename: generateFilename,
});

const upload = multer({ storage: multConfig });

const airportController = require('../Controller/airportController');
const contactFormController = require('../Controller/contactFormController');
const scheduleController = require('../Controller/scheduleController');
const flightRouteController = require('../Controller/flightRouteController');
const flightReservationController = require('../Controller/flightReservationController');
const hotelController = require('../Controller/hotelController');
const weatherController = require('../Controller/weatherController');
const chatController = require('../Controller/chatController');
const shuttleController = require('../Controller/shuttleController');
const dashboardController = require('../Controller/dashboardController');

corsConfig = {
  origin: ['http://localhost:3000', 'https://nayana.onrender.com/']
};

// Contact form submission
router.post('/api/contact', contactFormController.contactFormSubmit);

// Get airports
router.get('/api/flight/airports/:country', cors(corsConfig), airportController.getAirportsByCountry)

// Search schedules
router.post('/api/flight/schedules', cors(corsConfig), scheduleController.searchSchedule);

// Confirm flight reservation
router.post('/api/flight/reservations', cors(corsConfig), flightReservationController.confirmReservation);

// Get flight route map
router.get('/api/flight/route/image', cors(corsConfig), flightRouteController.getflightRouteMap);

// Get hotels
router.get('/api/hotels/:location/:showRestaurants/:rating', cors(corsConfig), hotelController.getHotels);

// Book a hotel
router.post('/api/hotels/book', cors(corsConfig), hotelController.bookHotel);

// Get weather by city
router.get('/api/weather/:city', cors(corsConfig), weatherController.getWeatherByCity);

// Get weather by coordinates
router.get('/api/weather/:lat/:lon', cors(corsConfig), weatherController.getWeatherByCoordinates);

// Chat
router.post('/api/chat', cors(corsConfig), chatController.chat);

// Confirm shuttle reservation
router.post('/api/shuttle/bookings', cors(corsConfig), shuttleController.confirmReservation);

// add new product 
router.post('/api/marketplace/add-product', cors(corsConfig), upload.single('image'), dashboardController.addNewItem);

//remove a product
router.delete('/api/marketplace/delete-product/:id/:userId', cors(corsConfig), dashboardController.removeProduct);

function generateFilename(req, file, cb) {
  // Extract the product name from the form
  const productName = req.body.name;

  // Generate a random number between 0 and 9999
  const randomNumber = Math.floor(Math.random() * 10000);

  // Create the modified file name
  const modifiedFileName = `${productName}-${randomNumber}${path.extname(file.originalname)}`;

  cb(null, modifiedFileName);
}

module.exports = router;
