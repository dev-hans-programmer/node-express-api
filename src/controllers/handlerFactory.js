const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const { catchAsync, sendJSend } = require('../utils/common');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) throw new AppError(`Doc with ID ${req.params.id} not found`, 404);
    return sendJSend(res, null, 204);
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) throw new AppError('No document found with that ID', 404);

    return sendJSend(res, { doc });
  });

exports.create = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.create(req.body);
    return sendJSend(res, { doc }, 201);
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;

    if (!doc)
      return next(
        new AppError(`Tour with ID ${req.params.id} not found `, 404)
      );
    // throw new AppError(`Tour with ID ${tourId} not found`, 404);
    return sendJSend(res, { doc });
  });

exports.getAll = (Model, populateOptions = []) =>
  catchAsync(async (req, res) => {
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .limitFields()
      .sort()
      .paginate();

    // Normalize populateOptions to always be an array
    const optionsArray = Array.isArray(populateOptions)
      ? populateOptions
      : [populateOptions];

    optionsArray.forEach((option) => {
      if (typeof option === 'string') {
        features.query = features.query.populate(option);
      } else if (typeof option === 'object' && option.path) {
        features.query = features.query.populate({
          path: option.path,
          select: option.select,
        });
      }
    });

    const docs = await features.query;

    return sendJSend(res, { tours: docs, total: docs.length });
  });
