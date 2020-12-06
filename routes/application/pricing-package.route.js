const express = require('express')
const jwtAuth = require('../../auth/jwt-auth')
const router = express.Router()
const PricingPackage = require('../../models/application/pricing-package.model')
const { handleError } = require('../../utils/errors')

router.get('/', async (req, res, next) => {
  try {
    const pricings = await PricingPackage.find()
    res.status(200).json(pricings)
  } catch (e) {
    handleError(e, res)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const pricingpackage = await PricingPackage.findById(req.params.id)
    res.status(200).json(pricingpackage)
  } catch (error) {
    res.status(500).json(error)
  }
})

router.post('/', jwtAuth, async (req, res, next) => {
  try {
    const pricingpackage = new PricingPackage({
      name: req.body.name,
      price: req.body.price,
      features: req.body.features
    })
    await pricingpackage.save()
    res.status(201).json(pricingpackage)
  } catch (e) {
    handleError(e, res)
  }
})

router.put('/:id', jwtAuth, async (req, res, next) => {
  try {
    let pricingpackage = new PricingPackage({
      _id: req.body.id,
      name: req.body.name,
      price: req.body.price,
      features: req.body.features
    })
    pricingpackage = await PricingPackage.findByIdAndUpdate(
      req.params.id,
      pricingpackage,
      { new: true	}
    )
    res.status(200).json(pricingpackage)
  } catch (e) {
    handleError(e, res)
  }
})

router.delete('/:id', jwtAuth, async (req, res, next) => {
  try {
    await PricingPackage.findByIdAndDelete(req.params.id)
    res.status(200).json('')
  } catch (e) {
    handleError(e, res)
  }
})

module.exports = router
