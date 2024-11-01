const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: [validator.isEmail, 'It must be an email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  photo: {
    type: String,
    required: [true, 'Photo is required'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
