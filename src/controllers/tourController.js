const Tour = require('../models/tourModel');
const { sendJSend } = require('../utils/common');

exports.getAllTours = async (req, res) => {
  // Filtering
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'limit', 'sort', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);

  // Advanced Filtering
  let queryStr = JSON.stringify(queryObj);
  // replace gt|gte|lt|lte with $gt|$gte|$lt|lte
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`); // \b -> match whole word

  // Execute the query
  let query = Tour.find(JSON.parse(queryStr));

  // sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  const tours = await query;
  return sendJSend(res, { tours });
};

exports.getTour = async (req, res) => {
  const tourId = req.params.id;
  const tour = await Tour.findById(tourId);
  return sendJSend(res, { tour });
};

exports.createTour = async (req, res) => {
  const newTour = await Tour.create(req.body);
  return sendJSend(res, { tour: newTour }, 201);
};

exports.updateTour = async (req, res) => {
  const tourId = req.params.id;

  const updatedTour = await Tour.findByIdAndUpdate(tourId, req.body, {
    new: true,
    runValidators: true,
  });
  return sendJSend(res, { tour: updatedTour });
};

exports.deleteTour = async (req, res) => {
  await Tour.findByIdAndDelete(req.params.id);
  return sendJSend(res, null, 204);
};
