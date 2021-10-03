const path = require('path');

const tmpFolder = path.resolve(__dirname, '../../tmp');
const dbFolder = path.resolve(__dirname, '../../db/');
const dbDumpFile = path.resolve(dbFolder, 'dump.json');
const imagesFolder = path.resolve(dbFolder, 'images');

module.exports = {
  PORT: 8080,
  tmpFolder,
  dbFolder,
  imagesFolder,
  dbDumpFile,
};
