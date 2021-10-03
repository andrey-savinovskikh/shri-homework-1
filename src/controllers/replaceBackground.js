const fs = require("fs");
const path = require("path");
const { replaceBackground } = require("backrem");
const sizeOf = require('image-size');

const { BadRequestApiError } = require("../errors/ApiError");
const { imagesFolder } = require('../config');
const { exists } = require('../utils/fs');
const db = require('../entities/Database');

module.exports = async (req, res, next) => {
  try {
    const {front, back, color, threshold} = req.query;

    if (!back || !front || !color || !threshold) {
      throw new BadRequestApiError('All params should be provided');
    }

    if (!Number.isInteger(Number(threshold))) {
      throw new BadRequestApiError('Wrong threshold is provided');
    }

    const colorArray = color.split(",").map(Number);
    const isWrongColor = colorArray.some((color) => !Number.isInteger(color) || color < 0 || color > 255);

    if (colorArray.length !== 3 || isWrongColor) {
      throw new BadRequestApiError('Wrong color data is provided');
    }

    const frontImage = db.findOne(front),
        backImage = db.findOne(back);

    if (!frontImage || !backImage) {
      throw new BadRequestApiError('Image doesn\'t exist');
    }

    const frontImagePath = path.resolve(imagesFolder, frontImage.filename),
        backImagePath = path.resolve(imagesFolder, backImage.filename);

    const isFrontImageExists = await exists(frontImagePath),
        isBackImageExists = await exists(backImagePath);

    if (!isFrontImageExists || !isBackImageExists) {
      throw new BadRequestApiError('Image doesn\'t exist');
    }

    const {width: frontImageWidth, height: frontImageHeight} = sizeOf(frontImagePath),
        {width: backImageWidth, height: backImageHeight} = sizeOf(backImagePath);

    if (frontImageWidth !== backImageWidth || frontImageHeight !== backImageHeight) {
      throw new BadRequestApiError('Image sizes are not equal');
    }

    const frontImageStream = fs.createReadStream(
      path.resolve(imagesFolder, frontImage.filename)
    );

    const backImageStream = fs.createReadStream(
      path.resolve(imagesFolder, backImage.filename)
    );

    replaceBackground(frontImageStream, backImageStream, colorArray, Number(threshold)).then(
      (readableStream) => {
        readableStream.pipe(res);
      }
    );
  } catch (err) {
    return next(err);
  }
};