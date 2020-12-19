const express = require('express')
const Event = require('../../models/event/event.model')
const { handleError } = require('../../utils/errors')
const jwtAuth = require('../../auth/jwt-auth')
const GetNumber = require('../../utils/get-number')
const router = express.Router()

// GET ALL events
router.get('/', async (req, res, next) => {
  try {
    const documents = await Event.find().sort({ createdAt: -1 })
      .populate('thumbnailImage')
      .populate('bannerImage')
      .populate('eventImages')
      .populate('presentedBy')
      .populate('inAssociationWith')
      .populate('sponsors')
      .populate('pricings')
      .populate({
        path: 'contacts',
        populate: {
          path: 'image'
        }
      })
    res.status(200).json(documents)
  } catch (e) {
    handleError(e, res)
  }
})

router.get('/list', async (req, res, next) => {
  try {
    const documents = await Event.find().sort({ createdAt: -1 })
    res.status(200).json(documents)
  } catch (e) {
    handleError(e, res)
  }
})

router.get('/featured', async (req, res, next) => {
  try {
    const documents = await Event.find().sort(
      { featured: -1, order: 1, createdAt: -1 }
    ).populate('thumbnailImage')
    res.status(200).json(documents)
  } catch (e) {
    handleError(e, res)
  }
})

// GET SINGLE EVENT
router.get('/id/:id', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('thumbnailImage')
      .populate('bannerImage')
      .populate('eventImages')
      .populate('presentedBy')
      .populate('inAssociationWith')
      .populate('sponsors')
      .populate('pricings')
      .populate({
        path: 'contacts',
        populate: {
          path: 'image'
        }
      })
    res.status(200).json(event)
  } catch (e) {
    handleError(e, res)
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
    handleError(e, res)
  }
})

// ADD Event
router.post('/', jwtAuth, async (req, res, next) => {
  try {
    let event = new Event({
      number: await GetNumber(Event),
      name: req.body.name,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
      priceRange: req.body.priceRange,
      thumbnailImage: req.body.thumbnailImage,
      bannerImage: req.body.bannerImage,
      description: req.body.description,
      featured: req.body.featured,
      active: req.body.active,
      order: req.body.order,
      eventImages: req.body.eventImages,
      socialLinks: req.body.socialLinks,
      presentedBy: req.body.presentedBy,
      inAssociationWith: req.body.inAssociationWith,
      sponsors: req.body.sponsors,
      pricings: req.body.pricings,
      ticketsLocations: req.body.ticketsLocations,
      contacts: req.body.contacts,
      latLng: req.body.latLng
    })

    await event.save()
    event = await Event.findById(event._id)
      .populate('thumbnailImage')
      .populate('bannerImage')
      .populate('eventImages')
      .populate('presentedBy')
      .populate('inAssociationWith')
      .populate('sponsors')
      .populate('pricings')
      .populate({
        path: 'contacts',
        populate: {
          path: 'image'
        }
      })
    res.status(201).json(event)
  } catch (e) {
    handleError(e, res)
  }
})

// UPDATE EVENT
router.put('/:id', jwtAuth, async (req, res, next) => {
  try {
    let event = new Event({
      _id: req.params.id,
      number: req.body.number,
      name: req.body.name,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
      priceRange: req.body.priceRange,
      thumbnailImage: req.body.thumbnailImage,
      bannerImage: req.body.bannerImage,
      description: req.body.description,
      featured: req.body.featured,
      active: req.body.active,
      order: req.body.order,
      socialLinks: req.body.socialLinks,
      eventImages: req.body.eventImages,
      presentedBy: req.body.presentedBy,
      inAssociationWith: req.body.inAssociationWith,
      sponsors: req.body.sponsors,
      pricings: req.body.pricings,
      ticketsLocations: req.body.ticketsLocations,
      contacts: req.body.contacts,
      latLng: req.body.latLng
    })
    await Event.findByIdAndUpdate(
      req.params.id,
      event
    )
    event = await Event.findById(event._id)
      .populate('thumbnailImage')
      .populate('bannerImage')
      .populate('eventImages')
      .populate('presentedBy')
      .populate('inAssociationWith')
      .populate('sponsors')
      .populate('pricings')
      .populate({
        path: 'contacts',
        populate: {
          path: 'image'
        }
      })
    res.status(200).json(event)
  } catch (e) {
    handleError(e, res)
  }
})

// Clean up events
router.delete('/:id', jwtAuth, async (req, res, next) => {
  try {
    await Event.findByIdAndDelete(req.params.id)
    res.sendStatus(200).json('')
  } catch (e) {
    handleError(e, res)
  }
})

module.exports = router
