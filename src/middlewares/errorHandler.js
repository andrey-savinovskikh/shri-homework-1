const { ApiError } = require('../errors/ApiError');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res) => {
  if (err instanceof ApiError) {
    return err.sendResponse(res);
  }

  return res.status(500).json({ message: err.message });
};