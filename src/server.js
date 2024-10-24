const mongoose = require('mongoose');

const app = require('./app');
const Config = require('./config');
const { logger } = require('./config/logger');

const connectDB = () => mongoose.connect(Config.DB_URI);

const port = Config.PORT || 9000;

const startServer = async () => {
  try {
    await connectDB();
    logger.info(`DB connected successfully`);
    app.listen(port, () => logger.info(`App running on port ${port}...`));
  } catch (err) {
    logger.error(err.message);
  }
};

startServer();
