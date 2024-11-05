const express = require('express');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');

const v1Router = require('./routes/v1');
const Config = require('./config');
const AppError = require('./utils/appError');

const { globalErrorHandler } = require('./controllers/errorController');

const app = express();

// Add security headers
app.use(helmet());
if (Config.NODE_ENV === 'dev') app.use(morgan('dev'));

// limit requests from the same IP
const limiter = rateLimit({
  max: 5,
  windowMs: 60 * 60 * 1000, // in 1 hour 5 request is allowed
  message: 'Too many requests from this IP, please try again later!',
});

app.use('/api', limiter);
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NOSQL query injection
app.use(mongoSanitize()); // this will remove the query from the request object
// for instance, if we send {"email":{"$gt":""},"password":"1234"}
// we can log in automatically without valid email

// Data sanitization against xss: Will remove malicious JS code from the request payload object
// It will transform the html tags into sth different as string
app.use(xss());

// Prevent parameter pollution
// will remove duplicate query key
app.use(
  hpp({
    whitelist: ['duration'], // duration might be duplicate in our query
  })
); // http parameter pollution

app.use(express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => res.send('Hello from the server side!'));

app.use('/api/v1', v1Router);

// error handling for undefined roites
app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Can't find route ${req.originalUrl} on the server global`,
      404
    )
  );
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
