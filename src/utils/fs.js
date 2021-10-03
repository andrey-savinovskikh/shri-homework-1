const fs = require('fs');
const util = require('util');

const writeFileAsync = util.promisify(fs.writeFile);
const copyFileAsync = util.promisify(fs.copyFile);
const unlinkFileAsync = util.promisify(fs.unlink);
const existsFileAsync = util.promisify(fs.exists);

module.exports = {
  copyFile: async (sourcePath, destinationPath) => {
    await copyFileAsync(sourcePath, destinationPath);
  },

  writeFile: async (path, content) => {
    await writeFileAsync(path, content);
  },

  removeFile: async (path) => {
    try {
      await unlinkFileAsync(path);
    } catch (err) {
      console.log(`removeFile error: file ${path} doesn't exist...`);
    }
  },

  exists: async (path) => {
    return await existsFileAsync(path);
  },
};