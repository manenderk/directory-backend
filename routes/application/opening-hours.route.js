const express = require('express')
const accessAuth = require('../../auth/access-auth')
const jwtAuth = require('../../auth/jwt-auth')
const router = express.Router()
const OpeningHours = require('../../models/application/opening-hours.model')
const { handleError } = require('../../utils/errors')

router.get('/', async (req, res, next) => {
  try {
    const openinghourss = await OpeningHours.find()
    res.status(200).json(openinghourss)
  } catch (e) {
    handleError(e, res)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const openinghours = await OpeningHours.findById(req.params.id)
    res.status(200).json(openinghours)
  } catch (error) {
    handleError(error, res)
  }
})

router.post('/', jwtAuth, accessAuth(['admin']), async (req, res, next) => {
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
    handleError(e, res)
  }
})

router.put('/:id', jwtAuth, accessAuth(['admin']), async (req, res, next) => {
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
    handleError(e, res)
  }
})

router.delete('/:id', jwtAuth, accessAuth(['admin']), async (req, res, next) => {
  try {
    await OpeningHours.findByIdAndDelete(req.params.id)
    res.status(200).json('')
  } catch (e) {
    handleError(e, res)
  }
})

module.exports = router
