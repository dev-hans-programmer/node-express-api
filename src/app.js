const express = require('express');
const morgan = require('morgan');

const v1Router = require('./routes/v1');
const Config = require('./config');
const AppError = require('./utils/appError');

const { globalErrorHandler } = require('./controllers/errorController');

const app = express();

if (Config.NODE_ENV === 'dev') app.use(morgan('dev'));
app.use(express.json());
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
