require('./config')
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const mongoose = require('mongoose');
const { auth } = require('express-openid-connect');

const db = mongoose.connection;
db.once('open', _ => {
  console.log('Database connected:', 'airline-cluster')
});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const port = process.env.PORT || 3000;

const pageRoutes = require('./routes/page_routes.js');
const destinationRoutes = require('./routes/destination_routes.js');
const dashboardRoutes = require('./routes/dashboard_routes.js');

const airportController = require('./Controller/airportController');
const contactFormController = require('./Controller/contactFormController');
const scheduleController = require('./Controller/scheduleController');
const flightRouteController = require('./Controller/flightRouteController');
const flightReservationController = require('./Controller/flightReservationController');
const hotelController = require('./Controller/hotelController');
const weatherController = require('./Controller/weatherController');
const chatController = require('./Controller/chatController');
const shuttleController = require('./Controller/shuttleController');
const { env } = require('process');

const auth_config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: 'http://localhost:3000',
  clientID: process.env.AUTH0_CLIENT,
  issuerBaseURL:process.env.AUTH0_ISSUER 
};

const app = express();

corsConfig={
  origin: ['http://localhost:3000', 'https://nayana.onrender.com/']
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(auth(auth_config));

app.use(pageRoutes);
app.use(dashboardRoutes);
app.use(destinationRoutes);

// Contact form submission
app.post('/api/contact', contactFormController.contactFormSubmit);

// Get airports
app.get('/api/flight/airports/:country',cors(corsConfig), airportController.getAirportsByCountry)

// Search schedules
app.post('/api/flight/schedules',cors(corsConfig), scheduleController.searchSchedule);

// Confirm flight reservation
app.post('/api/flight/reservations',cors(corsConfig), flightReservationController.confirmReservation);

// Get flight route map
app.get('/api/flight/route/image',cors(corsConfig), flightRouteController.getflightRouteMap);

// Get hotels
app.get('/api/hotels/:location/:showRestaurants/:rating',cors(corsConfig), hotelController.getHotels);

// Book a hotel
app.post('/api/hotels/book',cors(corsConfig), hotelController.bookHotel);

// Get weather by city
app.get('/api/weather/:city',cors(corsConfig), weatherController.getWeatherByCity);

// Get weather by coordinates
app.get('/api/weather/:lat/:lon',cors(corsConfig), weatherController.getWeatherByCoordinates);

// Chat
app.post('/api/chat',cors(corsConfig), chatController.chat);

// Confirm shuttle reservation
app.post('/api/shuttle/bookings',cors(corsConfig), shuttleController.confirmReservation);

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
