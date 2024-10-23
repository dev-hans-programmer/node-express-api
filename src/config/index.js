require('dotenv').config();

const { PORT, NODE_ENV } = process.env;

const Config = { PORT, NODE_ENV };

module.exports = Config;
