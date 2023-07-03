const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  _id: mongoose.SchemaTypes.ObjectId,
  auth0Id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  cart: {
    type: Array,
    default: [],
  },
  settings: {
    type: Object,
    default: {},
  },
});

const User = mongoose.model('User', userSchema, 'user');

module.exports = User;
