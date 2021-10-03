const path = require('path');

const { imagesFolder, tmpFolder } = require('../config');
const { copyFile, removeFile } = require('../utils/fs');

module.exports = class Image {
  constructor(data) {
    const {id, filename, uploadedAt, mimetype, size} = data;

    this.id = id || filename.split(".")[0];
    this.filename = filename;
    this.uploadedAt = uploadedAt || Date.now();
    this.size = size;
    this.mimetype = mimetype;
  }

  async save() {
    await copyFile(path.resolve(tmpFolder, this.filename), path.resolve(imagesFolder, this.filename));
  }

  async remove() {
    await removeFile(path.resolve(imagesFolder, this.filename));
  }

  async removeTmp() {
    await removeFile(path.resolve(tmpFolder, this.filename));
  }

  toJSON() {
    return {
      id: this.id,
      filename: this.filename,
      uploadedAt: this.uploadedAt,
      size: this.size,
      mimetype: this.mimetype
    };
  }
};