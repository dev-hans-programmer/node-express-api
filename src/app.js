const express = require('express');
const morgan = require('morgan');

const v1Router = require('./routes/v1');
const Config = require('./config');

const app = express();

if (Config.NODE_ENV === 'dev') app.use(morgan('dev'));
app.use(express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => res.send('Hello from the server side!'));

app.use('/api/v1', v1Router);

module.exports = app;
