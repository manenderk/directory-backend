const express = require('express')
const accessAuth = require('../../auth/access-auth')
const jwtAuth = require('../../auth/jwt-auth')
const router = express.Router()
const HomeSlider = require('../../models/application/home-slider.model')
const { handleError } = require('../../utils/errors')

router.get('/', async (req, res, next) => {
  try {
    const filters = {}
    if (req.query.active && req.query.active === 'true') {
      filters.active = true
    }
    const sliders = await HomeSlider.find(filters).sort({ createdAt: -1 }).populate('image')
    res.status(200).json(sliders)
  } catch (e) {
    handleError(e, res)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const slider = await HomeSlider.findById(req.params.id).populate('image')
    res.status(200).json(slider)
  } catch (e) {
    handleError(e, res)
  }
})

router.post('/', jwtAuth, accessAuth(['admin']), async (req, res, next) => {
  try {
    let homeSlider = new HomeSlider({
      image: req.body.image,
      link: req.body.link,
      active: req.body.active
    })
    await homeSlider.save()
    homeSlider = await HomeSlider.findById(homeSlider._id).populate('image')
    res.status(201).json(homeSlider)
  } catch (error) {
    handleError(error, res)
  }
})

router.put('/:id', jwtAuth, accessAuth(['admin']), async (req, res, next) => {
  try {
    const slider = new HomeSlider({
      _id: req.params.id,
      image: req.body.image,
      link: req.body.link,
      active: req.body.active
    })
    let updatedSlider = await HomeSlider.findByIdAndUpdate(
      req.params.id,
      slider,
      { new: true }
    )
    updatedSlider = await HomeSlider.findById(updatedSlider._id).populate('image')
    res.status(200).json(updatedSlider)
  } catch (error) {
    handleError(error, res)
  }
})

router.delete('/:id', jwtAuth, accessAuth(['admin']), async (req, res, next) => {
  try {
    await HomeSlider.findByIdAndDelete(req.params.id)
    res.status(200).json('')
  } catch (error) {
    handleError(error, res)
  }
})

module.exports = router
