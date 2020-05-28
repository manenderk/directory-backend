const express = require('express')
const BusinessType = require('@models/business/business-type.model')
const router = express.Router()
const config = require('@root/config')
const multer = require('multer')
const commonStorage = require('@root/utils/file-storage')

const storage = commonStorage(config.uploadDirectories.businessType)

// GET ALL BUSINESS TYPES
router.get('/', async (req, res, next) => {
  try {
    const documents = await BusinessType.find()
    res.status(200).json(documents)
  } catch (e) {
    res.status(500).json(e)
  }
})

// GET SINGLE BUSINESS TYPE
router.get('/:id', async (req, res, next) => {
  try {
    const businessType = await BusinessType.findById(req.params.id)
    if (businessType) {
      res.status(200).json(businessType)
    } else {
      res.sendStatus(401)
    }
  } catch (e) {
    res.status(500).json(e)
  }
})

// GET ALL FEATURED BUSINESS TYPES
router.get('/filter/featured', async (req, res, next) => {
  try {
    const businessTypes = await BusinessType.find({
      featured: true
    })
    res.status(200).json(businessTypes)
  } catch (e) {
    res.status(500).json(e)
  }
})

// ADD Business Type
router.post('/', multer({ storage }).single('thumbnail'), async (req, res, next) => {
  try {
    const businessType = new BusinessType({
      name: req.body.name,
      thumbnail: req.file ? config.uploadDirectories.businessType + '/' + req.file.filename : null,
      parentBusinessTypeId: req.body.parentBusinessTypeId && req.body.parentBusinessTypeId !== 'null' ? req.body.parentBusinessTypeId : null,
      featured: req.body.featured,
      active: req.body.active
    })

    const result = await businessType.save()

    res.status(201).json(result)
  } catch (e) {
    res.status(500).json(e)
  }
})

// UPDATE BUSINESS TYPE
router.put('/:id', multer({ storage }).single('thumbnail'), async (req, res, next) => {
  try {
    const businessType = new BusinessType({
      _id: req.params.id,
      name: req.body.name,
      thumbnail: req.file ? config.uploadDirectories.businessType + '/' + req.file.filename : req.body.thumbnail,
      parentBusinessTypeId: req.body.parentBusinessTypeId,
      featured: req.body.featured,
      active: req.body.active
    })
    const updatedBusinessType = await BusinessType.findByIdAndUpdate(
      req.params.id,
      businessType,
      { new: true }
    )
    res.status(200).json(updatedBusinessType)
  } catch (e) {
    res.status(500).json(e)
  }
})

// Clean up business types
router.delete('/all', async (req, res, next) => {
  try {
    await BusinessType.collection.drop()
    res.sendStatus(200)
  } catch (e) {
    res.status(500).json(e)
  }
})
module.exports = router
