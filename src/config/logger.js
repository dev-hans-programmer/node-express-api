const winston = require('winston');
const Config = require('.');

const logger = winston.createLogger({
  level: Config.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'natours-backend-service' },
  transports: [
    new winston.transports.File({
      dirname: 'logs',
      filename: 'combined.log',
      level: 'info',
      silent: Config.NODE_ENV === 'test',
    }),
    new winston.transports.File({
      dirname: 'logs',
      filename: 'error.log',
      level: 'error',
      silent: Config.NODE_ENV === 'test',
    }),
    new winston.transports.Console({
      silent: Config.NODE_ENV === 'productio',
    }),
  ],
});

module.exports = { logger };
