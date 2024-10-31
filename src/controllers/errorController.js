const Config = require('../config');
const { logger } = require('../config/logger');

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
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

  if (Config.NODE_ENV === 'production') {
    return sendProdError(err, res);
  }
  return sendDevError(err, res);
};
