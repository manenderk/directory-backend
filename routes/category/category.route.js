const express = require('express')
const Category = require('@models/category/category.model')
const router = express.Router()
const config = require('@root/config')
const uploader = require('@root/utils/file-uploader')(config.uploadDirectories.category, 'thumbnailFile')

// GET ALL CATEGORYS
router.get('/', async (req, res, next) => {
  try {
    const documents = await Category.find()
    res.status(200).json(documents)
  } catch (e) {
    res.status(500).json(e)
  }
})

// GET SINGLE CATEGORY
router.get('/:id', async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id)
    if (category) {
      res.status(200).json(category)
    } else {
      res.sendStatus(401)
    }
  } catch (e) {
    res.status(500).json(e)
  }
})

// GET ALL FEATURED CATEGORYS
router.get('/filter/featured', async (req, res, next) => {
  try {
    const categorys = await Category.find({
      featured: true
    })
    res.status(200).json(categorys)
  } catch (e) {
    res.status(500).json(e)
  }
})

// ADD Category
router.post('/', uploader, async (req, res, next) => {
  try {
    const category = new Category({
      name: req.body.name,
      thumbnail: req.file ? config.uploadDirectories.category + '/' + req.file.filename : null,
      parentCategoryId: req.body.parentCategoryId && req.body.parentCategoryId !== 'null' ? req.body.parentCategoryId : null,
      featured: req.body.featured,
      active: req.body.active,
      order: req.body.order
    })

    const result = await category.save()

    res.status(201).json(result)
  } catch (e) {
    res.status(500).json(e)
  }
})

// UPDATE CATEGORY
router.put('/:id', uploader, async (req, res, next) => {
  try {
    const category = new Category({
      _id: req.params.id,
      name: req.body.name,
      thumbnail: req.file ? config.uploadDirectories.category + '/' + req.file.filename : req.body.thumbnail,
      parentCategoryId: req.body.parentCategoryId,
      featured: req.body.featured,
      active: req.body.active,
      order: req.body.order
    })
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      category,
      { new: true }
    )
    res.status(200).json(updatedCategory)
  } catch (e) {
    res.status(500).json(e)
  }
})

// Clean up categorys
router.delete('/all', async (req, res, next) => {
  try {
    await Category.collection.drop()
    res.sendStatus(200)
  } catch (e) {
    res.status(500).json(e)
  }
})
module.exports = router
