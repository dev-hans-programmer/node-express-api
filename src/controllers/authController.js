const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const { catchAsync, sendJSend, encrypt } = require('../utils/common');
const Config = require('../config');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, Config.JWT_SECRET, {
    expiresIn: Config.JWT_EXPIRES_IN,
  });

exports.protect = catchAsync(async (req, res, next) => {
  // get the token from bearer header
  const header = req.headers.authorization;

  if (!header) return next(new AppError('Unauthorized', 401));

  const bearerToken = header.split(' ')[1];

  if (!bearerToken) return next(new AppError('Unauthorized', 401));

  // check the token validity
  const decodedPayload = await promisify(jwt.verify)(
    bearerToken,
    Config.JWT_SECRET
  );

  // check whether the user exists
  const user = await User.findById(decodedPayload.id);

  if (!user) return next(new AppError('Unauthorized', 401));

  // check whether the user has changed password after the token was issued
  if (user.changedPasswordAfter(decodedPayload.iat))
    return next(
      new AppError('User recently changed password, please log in again!', 401)
    );

  // eventually assign the user details in the req objct
  req.user = user;
  // call next
  next();
});

exports.restrictTo = (...roles) =>
  catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError('Unauthorized to access the resource', 403));

    next();
  });

exports.signUp = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);

  // sign the jwt
  const token = signToken(newUser._id);

  return sendJSend(res, { user: newUser, token }, 201);
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) throw new AppError('Invalid User', 401);

  // check both the password match
  if (!(await user.comparePassword(password, user.password)))
    throw new AppError('Invalid user', 401);

  const token = signToken(user._id);

  return sendJSend(res, { token });
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  // find the user
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError('There is no user with the email address', 404));

  // generate the random token
  const resetToken = user.createPasswordResetToken();
  await user.save();
  // send it to user's email
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetUrl}`;

  try {
    await sendEmail({
      message,
      email: req.body.email,
      subject: `Reset Password!`,
    });
    return sendJSend(res, { message: `Sent email successfully` });
  } catch (err) {
    // if it mails to send email then reset the token and expiry
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    throw new AppError(
      'There was an error sending the mail. Try again later!',
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { newPassword } = req.body;

  const encryptedToken = encrypt(req.params.token);

  const user = await User.findOne({
    passwordResetToken: encryptedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new AppError('Token is invalid or expired', 400);

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // find the user
  // check the token and also it's expiry
  // update the password
  // update the passwordChangedAt in user model
  // save the user
  // send response to client
  const token = signToken(user._id);

  return sendJSend(res, { token });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  // Get the user
  const user = await User.findById(req.user._id).select('+password');
  if (!user) throw new AppError('User not found', 404);

  if (!(await user.comparePassword(currentPassword, user.password)))
    throw new AppError('Password did not match', 400);

  user.password = newPassword; // we could have also used findOneAndUpdate
  // But in that case, our mongoose validator and
  // middleware will not run

  await user.save();

  return sendJSend(res, { message: 'Password has been updated' });
});
