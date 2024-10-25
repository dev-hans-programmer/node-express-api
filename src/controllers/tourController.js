const Tour = require('../models/tourModel');
const { sendJSend } = require('../utils/app');

exports.getAllTours = async (req, res) => {
  const tours = await Tour.find();
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
