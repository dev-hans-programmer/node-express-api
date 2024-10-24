require('dotenv').config();

const { PORT, NODE_ENV, DB_URI, LOG_LEVEL } = process.env;

const Config = { PORT, NODE_ENV, DB_URI, LOG_LEVEL };

module.exports = Config;
