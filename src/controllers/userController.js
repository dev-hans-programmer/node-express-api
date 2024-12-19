const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const { catchAsync, sendJSend } = require('../utils/common');
const { deleteOne, updateOne, getOne } = require('./handlerFactory');

const pick = (obj, ...props) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (props.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res) => {
  const apiFeatures = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await apiFeatures.query;

  return sendJSend(res, { users });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res) => {
  if (req.body.password)
    throw new AppError('This route is not for password update', 400);

  const filteredBody = pick(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      $set: filteredBody,
    },
    {
      new: true,
    }
  );

  return sendJSend(res, { message: 'Details updated', updatedUser });
});

exports.deleteMe = catchAsync(async (req, res) => {
  const deletedUser = await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      active: false,
    }
  );

  if (!deletedUser) throw new AppError('User does not exist', 404);

  return sendJSend(res, {}, 204);
});

exports.getUser = getOne(User);

exports.createUser = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);
  return sendJSend(res, { user: newUser }, 201);
});

exports.updateUser = updateOne(User);
exports.deleteUser = deleteOne(User);
