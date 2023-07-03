const mongoose = require('mongoose');
const db = require('../db/db');

// Define airport schema
const tourPackage = new mongoose.Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    Name: String,
    Category: String,
    Image: String,
    ImageAlt: String,
    Highlights: Array,
    Description: String,
    Itinerary: Array,
    Includes: Array,
    Excludes: Array,
    Price: Number,
    Duration: Number,
    Gallery: Array,
    Reviews: Array,
});

// Create airport model
const Package = mongoose.model('Package', tourPackage, 'tour-packages');

module.exports = Package;