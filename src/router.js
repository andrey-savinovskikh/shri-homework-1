const express = require('express');

const { multerUpload } = require('./utils/multerUpload');
const uploadImage = require('./controllers/uploadImage');
const getImagesList = require('./controllers/getImagesList');
const downloadImage = require('./controllers/downloadImage');
const deleteImage = require('./controllers/deleteImage');
const replaceBackground = require('./controllers/replaceBackground');

const router = new express.Router();

router.post('/upload', multerUpload.single("image"), uploadImage);
router.get('/list', getImagesList);
router.get('/image/:id', downloadImage);
router.delete('/image/:id', deleteImage);
router.get('/merge', replaceBackground);

exports.router = router;