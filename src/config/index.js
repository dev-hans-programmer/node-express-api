require('dotenv').config();

const {
  PORT,
  NODE_ENV,
  DB_URI,
  LOG_LEVEL,
  JWT_SECRET,
  JWT_EXPIRES_IN,

  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USERNAME,
  EMAIL_PASSWORD,
  EMAIL_FROM,
} = process.env;

const Config = {
  PORT,
  NODE_ENV,
  DB_URI,
  LOG_LEVEL,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USERNAME,
  EMAIL_PASSWORD,
  EMAIL_FROM,
};

module.exports = Config;
