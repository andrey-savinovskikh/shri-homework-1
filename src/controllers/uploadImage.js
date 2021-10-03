const db = require('../entities/Database');
const Image = require('../entities/Image');
const { BadRequestApiError } = require('../errors/ApiError');

module.exports = async (req, res, next) => {
  try {
    let fileData = req.file;

    if (!fileData || !Object.keys(fileData).length) {
      throw new BadRequestApiError('Wrong file is provided');
    }

    const {filename, mimetype, size} = fileData;

    const image = new Image({filename, mimetype, size});

    await db.insert(image);

    return res.json(image);
  } catch (err) {
    return next(err);
  }
};