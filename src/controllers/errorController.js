const Config = require('../config');
const { logger } = require('../config/logger');
const AppError = require('../utils/appError');

const handleCastErrorDb = (err) =>
  new AppError(`Invalid ${err.path}:${err.value}`, 400);

const handleDuplicateKeyDb = (err) => {
  const value = err.errmsg.match(/(['"])(.*?)\1/g);
  const msg = `Duplicate field value: ${value}, Please use another value`;
  return new AppError(msg, 400);
};

const handleValidationErrorDb = (err) => {
  const msg = Object.keys(err.errors)
    .map((key) => err.errors[key].message)
    .join('|');
  return new AppError(msg, 400);
};

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    err,
  });
};

const sendProdError = (err, res) => {
  // operational: trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // unknown error, programming error: don't leak details
  logger.error(err);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
};

exports.globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };

  // Explicitly set  `message` properties on the copied error object
  error.message = err.message;
  error.stack = err.stack;

  if (err.name === 'CastError') error = handleCastErrorDb(err);
  if (err.code === 11000) error = handleDuplicateKeyDb(err);
  if (err.name === 'ValidationError') error = handleValidationErrorDb(err);

  if (Config.NODE_ENV === 'production') {
    return sendProdError(error, res);
  }
  return sendDevError(error, res);
};
