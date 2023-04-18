const mongoose = require('mongoose');
const db = require('../db/db');

// Define airport schema
const airportSchema = new mongoose.Schema({
    number: Number,
    icao: String,
    name: String,
    latitude_deg: Number,
    longitude_deg: Number,
    elevation_ft: Number,
    continent: String,
    country: String,
    iso_region: String,
    municipality: String,
    scheduled_service: String,
    iata: String,
    home_link: String,
    wikipedia_link: String,
    keywords: String,
});

// Create airport model
const Airport = mongoose.model('Airport', airportSchema, 'airports');

module.exports = Airport;