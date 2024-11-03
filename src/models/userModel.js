const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    select: false,
  },
  photo: {
    type: String,
    required: [true, 'Photo is required'],
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (
  providedPassword,
  originalPassword
) {
  return bcrypt.compare(providedPassword, originalPassword);
};

userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
  if (!this.passwordChangedAt) return false; // user has never changed the password

  const changedTimestamp = parseInt(
    this.passwordChangedAt.getTime() / 1000,
    10
  );

  return jwtTimestamp < changedTimestamp; // means user has changed the password after the token was issued
};

const User = mongoose.model('User', userSchema);

module.exports = User;
