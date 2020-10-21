const express = require('express')
const router = express.Router()
const Business = require('@models/business/business.model')

// GET ALL BUSINESS TYPES
router.get('/', async (req, res, next) => {
  try {
    const businesses = await Business.find()
      .populate('category')
    res.status(200).json(businesses)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.get('/frontend', async (req, res, next) => {
  try {
    const filters = {}
    filters.active = true
    if (req.query.categoryId && req.query.categoryId !== 'null') {
      filters.category = req.query.categoryId
    }
    if (req.query.name && req.query.name !== 'null') {
      filters.name = { $regex: new RegExp(req.query.name, 'i') }
    }
    if (req.query.featured && req.query.featured !== 'null') {
      filters.featured = true
    }
    if (req.query.locationCoordinates && req.query.locationCoordinates !== 'null') {
      const coordinates = JSON.parse(req.query.locationCoordinates)
      console.log(coordinates.lat, coordinates.lng)
    }

    const sort = {}
    if (req.query.sortBy === 'distance') {
      sort.distance = 1
    } else if (req.query.sortBy === 'name') {
      sort.name = 1
    } else if (req.query.sortBy === 'rating') {
      sort.starRating = -1
    }

    const businesses = await Business.find(filters).sort(sort)
      .populate('thumbnailImage')
      .populate('openingHours')

    res.status(200).json(businesses)
  } catch (error) {
    res.status(500).json(error)
  }
})

// GET SINGLE BUSINESS TYPE
router.get('/id/:id', async (req, res, next) => {
  try {
    const business = await getBusiness(req.params.id)
    res.status(200).json(business)
  } catch (e) {
    res.status(500).json(e)
  }
})

// ADD BUSINESS
router.post('/', async (req, res, next) => {
  try {
    let business = getBusinessModelFromReqObject(req)
    await business.save()
    business = await getBusiness(business._id)
    res.status(201).json(business)
  } catch (e) {
    res.status(500).json(e)
  }
})

// UPDATE BUSINESS
router.put('/:id', async (req, res, next) => {
  try {
    let business = getBusinessModelFromReqObject(req, req.params.id)
    business = await Business.findByIdAndUpdate(
      req.params.id,
      business,
      { new: true }
    )
    business = await getBusiness(business._id)
    res.status(200).json(business)
  } catch (e) {
    res.status(500).json(e)
  }
})

async function getBusiness (id) {
  const business = await Business.findById(id)
    .populate('category')
    .populate('owner')
    .populate('productsAndServicesImages')
    .populate('openingHours')
    .populate('paymentMethods')
    .populate('team')
    .populate('thumbnailImage')
    .populate('bannerImage')
    .populate('images')
  return business
}

function getBusinessModelFromReqObject (req, id = null) {
  const business = new Business({
    name: req.body.name,
    category: req.body.category,
    starRating: req.body.starRating,
    person: req.body.person,
    phone: req.body.phone,
    email: req.body.email,
    latLng: req.body.latLng,
    website: req.body.website,
    address: req.body.address,
    description: req.body.description,
    productsAndServices: req.body.productsAndServices,
    specialities: req.body.specialities,
    languagesSpoken: req.body.languagesSpoken,
    openingHours: req.body.openingHours,
    paymentMethods: req.body.paymentMethods,
    team: req.body.team,
    thumbnailImage: req.body.thumbnailImage,
    bannerImage: req.body.bannerImage,
    images: req.body.images,
    featured: req.body.featured,
    active: req.body.active
  })
  if (id) {
    business._id = id
  }
  return business
}

module.exports = router
