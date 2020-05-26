const express = require('express');
const BusinessType = require('../models/business-types.model');
const router = express.Router();
const config = require('../config');
const fs = require('fs');


const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = 'public' + config.uploadDirectories.businessType;
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    cb(null, path);
  },
  filename: (req, file, cb) => {
    const newFileName = Date.now() + file.originalname.toLowerCase().split(' ').join('-');
    cb(null, newFileName);
  }
});


// GET ALL BUSINESS TYPES
router.get('/', async (req, res, next) => {
  try {
    const documents = await BusinessType.find();
    res.status(200).json(documents);
  } catch (e) {
    res.status(500).json(e);
  }
});


// GET SINGLE BUSINESS TYPE
router.get('/:id', async (req, res, next) => {
  try {
    const businessType = await BusinessType.findById(req.params.id);
    if (businessType) {
      res.status(200).json(businessType);
    } else {
      res.sendStatus(400);
    }
  } catch (e) {
    res.status(500).json(e);
  }
})

// ADD Business Type
router.post('/', multer({storage}).single('thumbnail'), async (req, res, next) => {
  try {
    const businessType = new BusinessType({
      name: req.body.name,
      thumbnail: req.file ? config.uploadDirectories.businessType + '/' + req.file.filename : null,
      parentBusinessTypeId: req.body.parentBusinessTypeId,
      active: req.body.active
    });

    const result = await businessType.save();

    res.status(201).json(result);

  } catch(e) {
    res.status(500).json(e);
  }
});

// UPDATE BUSINESS TYPE
router.put('/:id', multer({storage}).single('thumbnail'), async(req, res, next) => {
  try {
    const businessType = new BusinessType({
      _id: req.params.id,
      name: req.body.name,
      thumbnail: req.file ? config.uploadDirectories.businessType + '/' + req.file.filename : req.body.thumbnail,
      parentBusinessTypeId: req.body.parentBusinessTypeId,
      active: req.body.active
    });
    const updatedBusinessType = await BusinessType.findByIdAndUpdate(
      req.params.id,
      businessType
    );
    res.status(200).json(updatedBusinessType);
  } catch (e) {
    res.status(500).json(e);
  }
})

// Clean up business types
router.delete('/all', async (req, res, next) => {
  try {
    await BusinessType.collection.drop();
    res.sendStatus(200);
  } catch (e) {
    res.status(500).json(e);
  }
})
module.exports = router;
