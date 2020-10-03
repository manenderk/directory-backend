const express = require('express')
const Category = require('@models/category/category.model')
const router = express.Router()

// GET ALL categories
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

// GET ALL FEATURED categories
router.get('/filter/featured', async (req, res, next) => {
  try {
    const categories = await Category.find({
      featured: true
    })
    res.status(200).json(categories)
  } catch (e) {
    res.status(500).json(e)
  }
})

// ADD Category
router.post('/', async (req, res, next) => {
  try {
    let category = new Category({
      name: req.body.name,
      image: req.body.image,
      parentCategory: req.body.parentCategory,
      featured: req.body.featured,
      active: req.body.active,
      order: req.body.order
    })

    await category.save()
    category = await Category.findById(category._id).populate('image').populate('parentCategory')
    res.status(201).json(category)
  } catch (e) {
    res.status(500).json(e)
  }
})

// UPDATE CATEGORY
router.put('/:id', async (req, res, next) => {
  try {
    let category = new Category({
      name: req.body.name,
      image: req.body.image,
      parentCategory: req.body.parentCategory,
      featured: req.body.featured,
      active: req.body.active,
      order: req.body.order
    })
    await Category.findByIdAndUpdate(
      req.params.id,
      category
    )
    category = await Category.findById(category._id).populate('image').populate('parentCategory')
    res.status(200).json(category)
  } catch (e) {
    res.status(500).json(e)
  }
})

// Clean up categories
router.delete('/all', async (req, res, next) => {
  try {
    await Category.collection.drop()
    res.sendStatus(200).json('')
  } catch (e) {
    res.status(500).json(e)
  }
})
module.exports = router
