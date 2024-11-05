const crypto = require('crypto');
function sendJSend(res, data, statusCode = 200) {
  return res.status(statusCode).json({ success: true, data });
}

const catchAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const encrypt = (value) =>
  crypto.createHash('sha256').update(value).digest('hex');

const AppRoles = {
  ADMIN: 'admin',
  GUIDE: 'guide',
  LEAD_GUIDE: 'lead_guide',
  USER: 'user',
};

module.exports = { sendJSend, catchAsync, AppRoles, encrypt };
