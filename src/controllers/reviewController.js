const Review = require('../models/reviewModel');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const { catchAsync, sendJSend } = require('../utils/common');

exports.createReview = catchAsync(async (req, res) => {
  const { review, rating, tourId } = req.body;
  const userId = req.user._id;

  // find the user
  const user = await User.findById(userId);
  if (!user) throw new AppError(`User with ID: ${userId} not found`, 404);

  const tour = await Tour.findById(tourId);
  if (!tour) throw new AppError(`Tour with ID: ${tourId} not found`, 404);

  const createdReview = await Review.create({
    review,
    rating,
    user: userId,
    tour: tourId,
  });

  return sendJSend(res, { review: createdReview }, 201);
});
exports.getReviews = catchAsync(async (req, res) => {
  const features = new APIFeatures(Review.find(), req.query)
    .filter()
    .limitFields()
    .paginate()
    .populate('user')
    .populate('tour');
  const reviews = await features.query;

  return sendJSend(res, { reviews });
});
// exports.createReview = catchAsync(async (req, res) => {});
// exports.createReview = catchAsync(async (req, res) => {});
// exports.createReview = catchAsync(async (req, res) => {});
