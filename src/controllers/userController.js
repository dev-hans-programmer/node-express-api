const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const { catchAsync, sendJSend } = require('../utils/common');

exports.getAllUsers = catchAsync(async (req, res) => {
  const apiFeatures = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await apiFeatures.query;

  return sendJSend(res, { users });
});

exports.getUser = catchAsync(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);

  if (!user) throw new AppError(`User not found with ID: ${userId}`, 404);

  return sendJSend(res, { user });
});

exports.createUser = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);
  return sendJSend(res, { user: newUser }, 201);
});

exports.updateUser = (req, res) => {
  res.json({
    status: 'success',
    message: 'Not implemented yet',
  });
};

exports.deleteUser = (req, res) => {
  res.json({
    status: 'success',
    message: 'Not implemented yet',
  });
};
