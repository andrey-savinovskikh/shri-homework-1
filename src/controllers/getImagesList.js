const db = require('../entities/Database');

module.exports = (req, res, next) => {
  try {
    const images = db.find().map((image) => image.toJSON());

    return res.json(images);
  } catch (err) {
    return next(err);
  }
};