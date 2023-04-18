const mongoose = require('mongoose');
const config = require('../config');

const { MONGO_URI} = config;

mongoose.connect( MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('Error connecting to MongoDB:', err));

module.exports = mongoose.connection;