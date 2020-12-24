const express = require('express')
const accessAuth = require('../../auth/access-auth')
const jwtAuth = require('../../auth/jwt-auth')
const Category = require('../../models/category/category.model')
const { handleError } = require('../../utils/errors')
const GetNumber = require('../../utils/get-number')
const router = express.Router()

// GET ALL categories
router.get('/', async (req, res, next) => {
  try {
    const documents = await Category.find().sort({ createdAt: -1 }).populate('image').populate('parentCategory')
    res.status(200).json(documents)
  } catch (e) {
    handleError(e, res)
  }
})

// GET SINGLE CATEGORY
router.get('/id/:id', async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).populate('image').populate('parentCategory')
    res.status(200).json(category)
  } catch (e) {
    handleError(e, res)
  }
})

// GET ALL FEATURED categories
router.get('/frontend', async (req, res, next) => {
  try {
    const categories = await Category.find({
      active: true
    }).sort({
      featured: -1, order: 1, createdAt: -1
    }).populate('image').populate('parentCategory')
    res.status(200).json(categories)
  } catch (e) {
    handleError(e, res)
  }
})

// ADD Category
router.post('/', jwtAuth, accessAuth(['admin']), async (req, res, next) => {
  try {
    let category = new Category({
      name: req.body.name,
      number: await GetNumber(Category),
      image: req.body.image,
      parentCategory: req.body.parentCategory,
      description: req.body.description,
      featured: req.body.featured,
      active: req.body.active,
      order: req.body.order
    })

    await category.save()
    category = await Category.findById(category._id).populate('image').populate('parentCategory')
    res.status(201).json(category)
  } catch (e) {
    handleError(e, res)
  }
})

// UPDATE CATEGORY
router.put('/:id', jwtAuth, accessAuth(['admin']), async (req, res, next) => {
  try {
    let category = new Category({
      _id: req.params.id,
      number: req.body.number,
      name: req.body.name,
      image: req.body.image,
      parentCategory: req.body.parentCategory,
      description: req.body.description,
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
    handleError(e, res)
  }
})

module.exports = router
