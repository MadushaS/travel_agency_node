const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  _id: mongoose.SchemaTypes.ObjectId,
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  location: {
    type: [String],
    required: true
  },
  categories: {
    type: [String],
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  reviews: [{
    username: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    review: {
      type: String,
      required: true
    }
  }],
  // Additional fields for specific product types
  duration: String,
  amenities: [{
    type: String
  }],

  duration: String,
  includes: [{
    type: String
  }],

  carType: String,
  model: String,
  year: Number,
  color: String,
  capacity: Number,
  seats: Number,
  transmission: String,
  fuelType: String,

  highlights : [{
    type: String
  }],
  itinerary : [{
    type: String
  }],
  bring : [{
    type: String
  }],
  wear : [{
    type: String
  }],
  info : [{
    type: String
  }],
  transportation: String,
  heritage_sites: [{
    type: String
  }],
  archaeo_sites: [{
    type: String
  }],
  religious_sites: [{
    type: String
  }],
  museums: [{
    type: String
  }],
  cuisine: String,
  restrictions: {
    type: [String]
},
meal_type: String,
meal_time: String,
meal_style: String,

material: String,
size: String,
color: String,
weight: String,
manufacturer: String,
country: String,

therapist: String,
});

const Item = mongoose.model('Item', itemSchema, 'mp_products');
module.exports = Item;