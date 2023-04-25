require('./config')
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const mongoose = require('mongoose');

const db = mongoose.connection;
db.once('open', _ => {
  console.log('Database connected:', 'airline-cluster')
});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const port = process.env.PORT || 3000;

const pageRoutes = require('./routes/page_routes.js');
const destinationRoutes = require('./routes/destination_routes.js');

const airportController = require('./Controller/airportController');
const contactFormController = require('./Controller/contactFormController');
const scheduleController = require('./Controller/scheduleController');
const flightRouteController = require('./Controller/flightRouteController');
const flightReservationController = require('./Controller/flightReservationController');
const hotelController = require('./Controller/hotelController');
const weatherController = require('./Controller/weatherController');
const chatController = require('./Controller/chatController');
const shuttleController = require('./Controller/shuttleController');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(pageRoutes);
app.use(destinationRoutes);

app.post('/api/contact', contactFormController.contactFormSubmit);

app.get('/api/flight/airports/:country', airportController.getAirportsByCountry)

app.post('/api/flight/schedules', scheduleController.searchSchedule);

app.post('/api/flight/reservations', flightReservationController.confirmReservation);

app.get('/api/flight/route/image', flightRouteController.getflightRouteMap);

app.get('/api/hotels/:city', hotelController.getHotels);

app.post('/api/hotels/book', hotelController.bookHotel);

app.get('/api/weather/:city', weatherController.getWeatherByCity);
app.get('/api/weather/:lat/:lon', weatherController.getWeatherByCoordinates);

app.post('/api/chat', chatController.chat);

app.post('/api/shuttle/bookings', shuttleController.confirmReservation);

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
