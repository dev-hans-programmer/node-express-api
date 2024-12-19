const Tour = require('../models/tourModel');
const { sendJSend, catchAsync } = require('../utils/common');
const {
  deleteOne,
  updateOne,
  getOne,
  getAll,
  create,
} = require('./handlerFactory');

// exports.getAllTours = catchAsync(async (req, res) => {
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .limitFields()
//     .sort()
//     .paginate()
//     .populate('guides', 'name photo')
//     .populate('reviews');
//   const tours = await features.query;
//   return sendJSend(res, { tours, total: tours.length });
// });

exports.getAllTours = getAll(Tour, [
  { path: 'reviews', select: 'review' },
  { path: 'guides', select: 'name' },
]);

exports.getTour = getOne(Tour, {
  path: 'reviews',
  select: 'review',
});

exports.createTour = create(Tour);

exports.updateTour = updateOne(Tour);
exports.deleteTour = deleteOne(Tour);

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
