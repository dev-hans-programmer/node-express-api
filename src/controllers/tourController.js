const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const { sendJSend } = require('../utils/common');

exports.getAllTours = async (req, res) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .limitFields()
    .sort()
    .paginate();

  const tours = await features.query;
  return sendJSend(res, { tours, total: tours.length });
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
