const express = require('express')
const router = express.Router()
const PricingPackage = require('@models/application/pricing-package.model')

router.get('/', async (req, res, next) => {
  try {
    const pricings = await PricingPackage.find()
    res.status(200).json(pricings)
  } catch (e) {
    res.status(500).json(e)
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

router.post('/', async (req, res, next) => {
  try {
    const pricingpackage = new PricingPackage({
      name: req.body.name,
      price: req.body.price,
      features: req.body.features
    })
    await pricingpackage.save()
    res.status(201).json(pricingpackage)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.put('/:id', async (req, res, next) => {
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
    res.status(500).json(e)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await PricingPackage.findByIdAndDelete(req.params.id)
    res.status(200).json('')
  } catch (e) {
    res.status(500).json(e)
  }
})

module.exports = router
