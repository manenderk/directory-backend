const express = require('express')
const router = express.Router()
const Business = require('../models/business.model')

// GET ALL BUSINESS TYPES
router.get('/', async (req, res, next) => {
  try {
    const businesses = await Business.find()
    res.status(200).json(businesses)
  } catch (e) {
    res.status(500).json(e)
  }
})

// GET SINGLE BUSINESS TYPE
router.get('/:id', async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id)
    if (business) {
      res.status(200).json(business)
    } else {
      res.sendStatus(404)
    }
  } catch (e) {
    res.status(500).json(e)
  }
})

// ADD BUSINESS
router.post('/', async (req, res, next) => {
  try {
    const business = new Business({
      name: req.body.name,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      zipcode: req.body.zipcode,
      contactNumber: req.body.contactNumber,
      alternateContactNumber: req.body.alternateContactNumber,
      email: req.body.email,
      alternateEmail: req.body.alternateEmail,
      longitude: req.body.longitude,
      langitude: req.body.langitude,
      ownerNotes: req.body.ownerNotes,
      startDate: req.body.startDate ? new Date(req.body.startDate) : null,
      owner: req.body.owner,
      featured: req.body.featured,
      active: req.body.active
    })
    await business.save()
    res.status(201).json(business)
  } catch (e) {
    res.status(500).json(e)
  }
})

// UPDATE BUSINESS
router.put('/:id', async (req, res, next) => {
  try {
    const business = new Business({
      _id: req.params.id,
      name: req.body.name,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      zipcode: req.body.zipcode,
      contactNumber: req.body.contactNumber,
      alternateContactNumber: req.body.alternateContactNumber,
      email: req.body.email,
      alternateEmail: req.body.alternateEmail,
      longitude: req.body.longitude,
      langitude: req.body.langitude,
      ownerNotes: req.body.ownerNotes,
      startDate: req.body.startDate ? new Date(req.body.startDate) : null,
      owner: req.body.owner,
      featured: req.body.featured,
      active: req.body.active
    })
    const updatedBusiness = await Business.findByIdAndUpdate(
      req.params.id,
      business,
      { new: true }
    )
    res.status(201).json(updatedBusiness)
  } catch (e) {
    res.status(500).json(e)
  }
})

module.exports = router
