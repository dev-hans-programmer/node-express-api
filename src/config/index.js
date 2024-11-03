require('dotenv').config();

const { PORT, NODE_ENV, DB_URI, LOG_LEVEL, JWT_SECRET, JWT_EXPIRES_IN } =
  process.env;

const Config = {
  PORT,
  NODE_ENV,
  DB_URI,
  LOG_LEVEL,
  JWT_SECRET,
  JWT_EXPIRES_IN,
};

module.exports = Config;
