const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const { catchAsync, sendJSend } = require('../utils/common');
const Config = require('../config');
const AppError = require('../utils/appError');

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
  req.userId = user._id;
  // call next
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
