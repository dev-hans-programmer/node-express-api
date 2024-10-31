const mongoose = require('mongoose');

const app = require('./app');
const Config = require('./config');
const { logger } = require('./config/logger');

const connectDB = () => mongoose.connect(Config.DB_URI);

const port = Config.PORT || 9000;

let server;

function closeServer(err, isUncaught = false) {
  logger.info(err.name);
  logger.error(err.message);
  logger.info(
    `${isUncaught ? 'Uncaught Exception' : 'Unhandled rejection'}, shutting down gracefully`
  );
  if (server) server.close(() => process.exit(1));
  else process.exit(1);
}
process.on('uncaughtException', (err) => {
  closeServer(err, true);
});

const startServer = async () => {
  try {
    await connectDB();
    logger.info(`DB connected successfully`);

    server = app.listen(port, () =>
      logger.info(`App running on port ${port}...`)
    );
  } catch (err) {
    logger.error(err.message);
    process.exit(1);
  }
};

// unhandled promise rejection error throughtout our app
process.on('unhandledRejection', (err) => {
  closeServer(err);
});

startServer();
