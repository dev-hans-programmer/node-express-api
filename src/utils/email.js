const nodemailer = require('nodemailer');
const Config = require('../config');

const { logger } = require('../config/logger');

const sendEmail = async (options) => {
  const { EMAIL_FROM, EMAIL_HOST, EMAIL_PASSWORD, EMAIL_PORT, EMAIL_USERNAME } =
    Config;

  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: +EMAIL_PORT,
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    text: options.message,
  });
  logger.info(`Message sent: ${info.messageId}`);
};

module.exports = sendEmail;
