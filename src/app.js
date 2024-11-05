const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

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
