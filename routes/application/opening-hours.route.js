const express = require('express')
const jwt = require('express-jwt')
const jwtAuth = require('../../auth/jwt-auth')
const router = express.Router()
const OpeningHours = require('../../models/application/opening-hours.model')

router.get('/', async (req, res, next) => {
  try {
    const openinghourss = await OpeningHours.find()
    res.status(200).json(openinghourss)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const openinghours = await OpeningHours.findById(req.params.id)
    res.status(200).json(openinghours)
  } catch (error) {
    res.status(500).json(error)
  }
})

router.post('/', jwtAuth, async (req, res, next) => {
  try {
    const openinghours = new OpeningHours({
      monday: req.body.monday,
      tuesday: req.body.tuesday,
      wednesday: req.body.wednesday,
      thursday: req.body.thursday,
      friday: req.body.friday,
      saturday: req.body.saturday,
      sunday: req.body.sunday
    })
    await openinghours.save()
    res.status(201).json(openinghours)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.put('/:id', jwtAuth, async (req, res, next) => {
  try {
    let openinghours = new OpeningHours({
      _id: req.body.id,
      monday: req.body.monday,
      tuesday: req.body.tuesday,
      wednesday: req.body.wednesday,
      thursday: req.body.thursday,
      friday: req.body.friday,
      saturday: req.body.saturday,
      sunday: req.body.sunday
    })
    await OpeningHours.findByIdAndUpdate(
      req.params.id,
      openinghours
    )
    openinghours = await OpeningHours.findById(openinghours._id)
    res.status(200).json(openinghours)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await OpeningHours.findByIdAndDelete(req.params.id)
    res.status(200).json('')
  } catch (e) {
    res.status(500).json(e)
  }
})

module.exports = router
