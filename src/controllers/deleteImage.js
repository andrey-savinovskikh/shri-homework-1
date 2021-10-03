const db = require('../entities/Database');

module.exports = async (req, res, next) => {
  try {
    const imageId = req.params.id;

    const image = await db.remove(imageId);

    return res.json({ id: image.id });
  } catch (err) {
    return next(err);
  }
};