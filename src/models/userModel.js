const mongoose = require('mongoose');
const crypto = require('crypto');
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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

async function encryptPassword(password) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  if (this.isNew) {
    this.password = await encryptPassword(this.password);
  } else {
    // means only trying to update the password so encrypt it as well as save the passwordChangedAt property
    this.password = await encryptPassword(this.password);
    this.passwordChangedAt = Date.now() - 1000; // Sometimes it takes time to update the DB, hence subtracting 1 sec to make sure the token is always is issued after the passwordChangedAt value so that we can log in
  }

  next();
});

userSchema.pre(/^find/, function (next) {
  // exclude the docs which is not active
  this.find({ active: { $ne: false } });
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

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 mins expiry

  return resetToken; // for sending via mail
};

const User = mongoose.model('User', userSchema);

module.exports = User;
