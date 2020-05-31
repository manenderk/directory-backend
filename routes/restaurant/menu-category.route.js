const express = require('express')
const router = express.Router()
const MenuCategory = require('@models/restaurant/menu-category.model')
const config = require('@root/config')
const fileUploader = require('@root/utils/file-uploader')(config.uploadDirectories.MenuCategorym, 'thumbnail')

router.get('/', async (req, res, next) => {
  try {
    const categories = await MenuCategory.find()
    res.status(200).json(categories)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.get('/business-id/:businessId', async (req, res, next) => {
  try {
    const categories = await MenuCategory.find({
      businessId: req.params.businessId
    })
    res.status(200).json(categories)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.post('/', fileUploader, async (req, res, next) => {
  try {
    const category = new MenuCategory({
      businessId: req.body.businessId,
      name: req.body.name,
      thumbnail: req.file ? req.file.filename : null,
      featured: req.body.featured,
      active: req.body.active
    })
    const savedCategory = await category.save()
    res.status(201).json(savedCategory)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.put('/:id', fileUploader, async (req, res, next) => {
  try {
    const updatedCategory = await MenuCategory.findByIdAndUpdate(
      req.params.id, {
        businessId: req.body.businessId,
        name: req.body.name,
        thumbnail: req.file ? req.file.filename : req.body.thumbnail,
        featured: req.body.featured,
        active: req.body.active
      }, {
        new: true
      }
    )
    res.status(200).json(updatedCategory)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await MenuCategory.findByIdAndDelete(req.params.id)
    res.sendStatus(200)
  } catch (e) {
    res.status(500).json(e)
  }
})

module.exports = router
