function sendJSend(res, data, statusCode = 200) {
  return res.status(statusCode).json({ success: true, data });
}

const catchAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);

module.exports = { sendJSend, catchAsync };
