const { EventEmitter } = require('events');

const { dbDumpFile } = require('../config');
const { writeFile } = require('../utils/fs');
const { prettifyJsonToString } = require('../utils/prettifyJsonToString');
const { BadRequestApiError } = require('../errors/ApiError');
const { exists } = require('../utils/fs');
const Image = require('./Image');

class Database extends EventEmitter {
  constructor() {
    super();

    this.images = {};
  }

  async initFromDump() {
    const isDumpFileExists = await exists(dbDumpFile);

    if (!isDumpFileExists) {
      return;
    }

    const dump = require(dbDumpFile);

    if (typeof dump.images === 'object') {
      this.images = {};

      for (let id in dump.images) {
        if (dump.images.hasOwnProperty(id)) {
          const image = dump.images[id];

          this.images[id] = new Image(image);
        }
      }
    }
  }

  async insert(image) {
    await image.save();
    await image.removeTmp();

    this.images[image.id] = image;

    this.emit('changed');
  }

  async remove(id) {
    const imageRaw = this.images[id];

    if (!imageRaw) {
      throw new BadRequestApiError('Image doesn\'t exist');
    }

    const image = new Image(imageRaw);

    await image.remove();

    delete this.images[id];

    this.emit('changed');

    return image;
  }

  findOne(filename) {
    const image = this.images[filename];

    if (!image) {
      return null;
    }

    return image;
  }

  find() {
    let allImages = Object.values(this.images);

    allImages.sort((a, b) => b.uploadedAt - a.uploadedAt);

    return allImages;
  }

  toJSON() {
    return {
      images: this.images
    };
  }
}

const db = new Database();

db.initFromDump();

db.on('changed', () => {
  writeFile(dbDumpFile, prettifyJsonToString(db.toJSON()));
});

module.exports = db;
