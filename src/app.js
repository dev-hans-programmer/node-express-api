const express = require('express');
const morgan = require('morgan');

const v1Router = require('./routes/v1');

const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => res.send('Hello from the server side!'));

app.use('/api/v1', v1Router);

module.exports = app;
