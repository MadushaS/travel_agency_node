require('./config')
const express = require('express');
const bodyParser = require('body-parser');
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
const apiRoutes = require('./routes/api_routes.js');

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



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(auth(auth_config));

app.use(pageRoutes);
app.use(dashboardRoutes);
app.use(destinationRoutes);
app.use(apiRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
