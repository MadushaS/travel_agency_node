const mongoose = require('mongoose');

// Define airport schema
const airportSchema = new mongoose.Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    icao: String,
    name: String,
    latitude_deg: Number,
    longitude_deg: Number,
    elevation_ft: Number,
    continent: String,
    country: String,
    iso_region: String,
    city: String,
    iata: String,
});

// Create airport model
const Airport = mongoose.model('Airport', airportSchema, 'airports');

module.exports = Airport;