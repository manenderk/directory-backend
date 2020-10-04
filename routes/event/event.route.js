const express = require('express')
const Event = require('@models/event/event.model')
const router = express.Router()

// GET ALL events
router.get('/', async (req, res, next) => {
  try {
    const documents = await Event.find().sort({ createdAt: -1 })
      .populate('thumbnailImage')
      .populate('bannerImage')
      .populate('presentedBy')
      .populate('InAssociationWith')
      .populate('Sponsors')
      .populate('Pricing')
      .populate('Contacts')
    res.status(200).json(documents)
  } catch (e) {
    res.status(500).json(e)
  }
})

// GET SINGLE EVENT
router.get('/id/:id', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('thumbnailImage')
      .populate('bannerImage')
      .populate('presentedBy')
      .populate('InAssociationWith')
      .populate('Sponsors')
      .populate('Pricing')
      .populate('Contacts')
    res.status(200).json(event)
  } catch (e) {
    res.status(500).json(e)
  }
})

// GET ALL FEATURED events
router.get('/frontend', async (req, res, next) => {
  try {
    const events = await Event.find({
      active: true
    }).sort({
      featured: -1, order: 1, createdAt: -1
    }).populate('thumbnailImage')
    res.status(200).json(events)
  } catch (e) {
    res.status(500).json(e)
  }
})

// ADD Event
router.post('/', async (req, res, next) => {
  try {
    let event = new Event({
      name: req.body.name,
      date: req.body.date,
      address: req.body.address,
      thumbnailImage: req.body.thumbnailImage,
      banerImage: req.body.bannerImage,
      description: req.body.description,
      featured: req.body.featured,
      active: req.body.active,
      order: req.body.order,
      socialLinks: req.body.socialLinks,
      presentedBy: req.body.presentedBy,
      inAssociationWith: req.body.inAssociationWith,
      sponsors: req.body.sponsors,
      pricings: req.body.pricings,
      ticketsLocation: req.body.ticketsLocation,
      contacts: req.body.contacts
    })

    await event.save()
    event = await Event.findById(event._id)
      .populate('thumbnailImage')
      .populate('bannerImage')
      .populate('presentedBy')
      .populate('InAssociationWith')
      .populate('Sponsors')
      .populate('Pricing')
      .populate('Contacts')
    res.status(201).json(event)
  } catch (e) {
    res.status(500).json(e)
  }
})

// UPDATE EVENT
router.put('/:id', async (req, res, next) => {
  try {
    let event = new Event({
      _id: req.params.id,
      name: req.body.name,
      date: req.body.date,
      address: req.body.address,
      thumbnailImage: req.body.thumbnailImage,
      banerImage: req.body.bannerImage,
      description: req.body.description,
      featured: req.body.featured,
      active: req.body.active,
      order: req.body.order,
      socialLinks: req.body.socialLinks,
      presentedBy: req.body.presentedBy,
      inAssociationWith: req.body.inAssociationWith,
      sponsors: req.body.sponsors,
      pricings: req.body.pricings,
      ticketsLocation: req.body.ticketsLocation,
      contacts: req.body.contacts
    })
    await Event.findByIdAndUpdate(
      req.params.id,
      event
    )
    event = await Event.findById(event._id)
      .populate('thumbnailImage')
      .populate('bannerImage')
      .populate('presentedBy')
      .populate('InAssociationWith')
      .populate('Sponsors')
      .populate('Pricing')
      .populate('Contacts')
    res.status(200).json(event)
  } catch (e) {
    res.status(500).json(e)
  }
})

// Clean up events
router.delete('/:id', async (req, res, next) => {
  try {
    await Event.findByIdAndDelete(req.params.id)
    res.sendStatus(200).json('')
  } catch (e) {
    res.status(500).json(e)
  }
})

module.exports = router
