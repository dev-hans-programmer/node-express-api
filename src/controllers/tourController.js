const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const { sendJSend, catchAsync } = require('../utils/common');

exports.getAllTours = catchAsync(async (req, res) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .limitFields()
    .sort()
    .paginate();

  const tours = await features.query;
  return sendJSend(res, { tours, total: tours.length });
});

exports.getTour = catchAsync(async (req, res) => {
  const tourId = req.params.id;
  const tour = await Tour.findById(tourId);
  return sendJSend(res, { tour });
});

exports.createTour = catchAsync(async (req, res) => {
  const newTour = await Tour.create(req.body);
  return sendJSend(res, { tour: newTour }, 201);
});

exports.updateTour = catchAsync(async (req, res) => {
  const tourId = req.params.id;

  const updatedTour = await Tour.findByIdAndUpdate(tourId, req.body, {
    new: true,
    runValidators: true,
  });
  return sendJSend(res, { tour: updatedTour });
});

exports.deleteTour = catchAsync(async (req, res) => {
  await Tour.findByIdAndDelete(req.params.id);
  return sendJSend(res, null, 204);
});

exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        avgRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 }, // Asc
    },
    {
      $match: {
        _id: { $ne: 'EASY' }, // Exclude easy tours
      },
    },
  ]);
  return sendJSend(res, { stats });
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const { year } = req.params;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', // deconstruct the array and create individual objects for each item
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $project: { _id: 0 }, // hide '_id'
    },
  ]);
  return sendJSend(res, { plan });
});
