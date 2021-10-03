const path = require('path');
const multer  = require("multer");

const { tmpFolder } = require('../config');
const { generateId } = require('../utils/generateId');
const { BadRequestApiError } = require('../errors/ApiError');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tmpFolder)
  },
  filename: function (req, file, cb) {
    cb(null, generateId() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  fileFilter: function(_req, file, cb){
    checkFileType(file, cb);
  }
});

function checkFileType(file, cb){
  const filetypes = /jpeg|jpg/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname){
    return cb(null,true);
  } else {
    cb(new BadRequestApiError('Only jpg/jpeg is allowed'));
  }
}

exports.multerUpload = upload;
