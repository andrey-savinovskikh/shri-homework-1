const path = require('path');

const db = require('../entities/Database');
const { BadRequestApiError, NotFoundApiError } = require('../errors/ApiError');
const { imagesFolder } = require('../config');

module.exports = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!id) {
      throw new BadRequestApiError('Id should be provided');
    }

    const file = db.findOne(id);

    if (!file) {
      throw new NotFoundApiError('Image doesn\'t exist');
    }

    res.download(path.resolve(imagesFolder, file.filename));
  } catch (err) {
    return next(err);
  }
};