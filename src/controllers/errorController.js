const Config = require('../config');
const { logger } = require('../config/logger');
const AppError = require('../utils/appError');

const handleCastErrorDb = (err) =>
  new AppError(`Invalid ${err.path}:${err.value}`, 400);

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

  console.log('ERROR NAME ', err.name, err.message);
  console.log('ERROR KIND ', err.kind);

  if (Config.NODE_ENV === 'production') {
    let error = { ...err };

    // Explicitly set  `message` properties on the copied error object
    error.message = err.message;

    if (err.name === 'CastError') error = handleCastErrorDb(error);
    return sendProdError(error, res);
  }
  return sendDevError(err, res);
};
