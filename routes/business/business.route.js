const express = require('express')
const router = express.Router()
const Business = require('../../models/business/business.model')
const BusinessReview = require('../../models/business/business-review.model')
const Mongoose = require('mongoose')
const {
  NotFoundError,
  handleError
} = require('../../utils/errors')
const GetNumber = require('../../utils/get-number')

// GET ALL BUSINESS TYPES
router.get('/', async (req, res, next) => {
  try {
    const businesses = await Business.find()
      .populate('category').sort('-createdAt')
    res.status(200).json(businesses)
  } catch (error) {
    handleError(error, res)
  }
})

/**
 * filters query params::
 * categoryId: string,
 * name: string,
 * featured: boolean,
 * lat: number
 * lng: number
 * distance: number
 */
/**
 * sort query paramss::
 * sortBy: distance | name | rating
 */
router.get('/frontend-listing', async (req, res, next) => {
  try {
    const filters = {}
    filters.active = true
    if (req.query.categoryId && req.query.categoryId !== 'null') {
      filters.category = Mongoose.Types.ObjectId(req.query.categoryId)
    }
    if (req.query.name && req.query.name !== 'null') {
      filters.name = {
        $regex: new RegExp(req.query.name, 'i')
      }
    }
    if (req.query.featured && req.query.featured !== 'null') {
      filters.featured = true
    }

    let distanceFilters = null

    if (req.query.lat && req.query.lat !== 'null' && req.query.lng && req.query.lng !== 'null' && req.query.distance && req.query.distance !== 'null') {
      distanceFilters = {
        lat: parseFloat(req.query.lat),
        lng: parseFloat(req.query.lng),
        distance: parseInt(req.query.distance)
      }
    }

    let sort = {}
    if (req.query.sortBy === 'distance') {
      sort.distance = 1
    } else if (req.query.sortBy === 'name') {
      sort.name = 1
      /* sort = {
        'business.name': 1
      } */
    } else if (req.query.sortBy === 'rating') {
      sort.averageRating = -1
      // eslint-disable-next-line quote-props
      sort = {
        averageRating: -1
      }
    } else {
      sort.name = 1
      /* sort = {
        'business.name': 1
      } */
    }

    let data = []

    if (distanceFilters) {
      data = await Business.aggregate([
        [{
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [distanceFilters.lng, distanceFilters.lat]
            },
            distanceField: 'distance',
            query: filters,
            spherical: true,
            maxDistance: distanceFilters.distance
          }
        }, {
          $lookup: {
            from: 'businessreviews',
            localField: '_id',
            foreignField: 'businessId',
            as: 'reviews'
          }
        }, {
          $unwind: {
            path: '$reviews',
            preserveNullAndEmptyArrays: true
          }
        }, {
          $group: {
            _id: '$_id',
            name: {
              $first: '$name'
            },
            address: {
              $first: '$address'
            },
            thumbnailMediaId: {
              $first: '$thumbnailImage'
            },
            website: {
              $first: '$website'
            },
            phone: {
              $first: '$phone'
            },
            email: {
              $first: '$email'
            },
            latLng: {
              $first: '$latLng'
            },
            averageRating: {
              $avg: '$reviews.rating'
            },
            reviewCount: {
              $sum: 1
            },
            distance: {
              $first: '$distance'
            }
          }
        }, {
          $lookup: {
            from: 'media',
            localField: 'thumbnailMediaId',
            foreignField: '_id',
            as: 'thumbnailImage'
          }
        }, {
          $unwind: {
            path: '$thumbnailImage',
            preserveNullAndEmptyArrays: true
          }
        }, {
          $sort: sort
        }]
      ])
    } else {
      data = await Business.aggregate([
        [{
          $match: filters
        }, {
          $lookup: {
            from: 'businessreviews',
            localField: '_id',
            foreignField: 'businessId',
            as: 'reviews'
          }
        }, {
          $unwind: {
            path: '$reviews',
            preserveNullAndEmptyArrays: true
          }
        }, {
          $group: {
            _id: '$_id',
            name: {
              $first: '$name'
            },
            address: {
              $first: '$address'
            },
            thumbnailMediaId: {
              $first: '$thumbnailImage'
            },
            website: {
              $first: '$website'
            },
            phone: {
              $first: '$phone'
            },
            email: {
              $first: '$email'
            },
            latLng: {
              $first: '$latLng'
            },
            averageRating: {
              $avg: '$reviews.rating'
            },
            reviewCount: {
              $sum: 1
            },
            distance: {
              $first: '$distance'
            }
          }
        }, {
          $lookup: {
            from: 'media',
            localField: 'thumbnailMediaId',
            foreignField: '_id',
            as: 'thumbnailImage'
          }
        }, {
          $unwind: {
            path: '$thumbnailImage',
            preserveNullAndEmptyArrays: true
          }
        }, {
          $sort: sort
        }]
      ])
    }

    res.status(200).json(data)
  } catch (error) {
    handleError(error, res)
  }
})

/* router.get('/frontend', async (req, res, next) => {
  try {
    const filters = {}
    filters.active = true
    if (req.query.categoryId && req.query.categoryId !== 'null') {
      filters.category = req.query.categoryId
    }
    if (req.query.name && req.query.name !== 'null') {
      filters.name = {
        $regex: new RegExp(req.query.name, 'i')
      }
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

    const businessesResponse = []

    await Promise.all(
      businesses.map(async business => {
        const bObj = business.toObject()
        bObj.reviewCount = await getBusinessReviewsCounts(bObj._id)
        businessesResponse.push(bObj)
      })
    )
    res.status(200).json(businessesResponse)
  } catch (error) {
    res.status(500).json(error)
  }
})
 */
// GET SINGLE BUSINESS TYPE
router.get('/id/:id', async (req, res, next) => {
  try {
    let business = await getBusiness(req.params.id)
    if (!business) {
      throw new NotFoundError()
    }
    const reviewData = await getReviewData(business._id)
    business = business.toObject()
    if (reviewData) {
      business.reviewCount = reviewData.count
      business.averageRating = reviewData.averageRating
    } else {
      business.reviewCount = 0
      business.averageRating = null
    }

    res.status(200).json(business)
  } catch (e) {
    handleError(e, res)
  }
})

// ADD BUSINESS
router.post('/', async (req, res, next) => {
  try {
    let business = await getBusinessModelFromReqObject(req)
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
    let business = await getBusinessModelFromReqObject(req, req.params.id)
    business = await Business.findByIdAndUpdate(
      req.params.id,
      business, {
        new: true
      }
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
    .populate({
      path: 'owner',
      populate: {
        path: 'image'
      }
    })
    .populate('productsAndServicesImages')
    .populate('openingHours')
    .populate('paymentMethods')
    .populate({
      path: 'team',
      populate: {
        path: 'image'
      }
    })
    .populate('thumbnailImage')
    .populate('bannerImage')
    .populate('images')
  return business
}

async function getBusinessModelFromReqObject (req, id = null) {
  const business = new Business({
    name: req.body.name,
    category: req.body.category,
    starRating: req.body.starRating,
    owner: req.body.owner,
    phone: req.body.phone,
    email: req.body.email,
    latLng: req.body.latLng,
    website: req.body.website,
    address: req.body.address,
    description: req.body.description,
    productsAndServices: req.body.productsAndServices,
    productsAndServicesImages: req.body.productsAndServicesImages,
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
    business.number = req.body.number
  } else {
    business.number = await GetNumber(Business)
  }
  return business
}

async function getReviewData (businessId) {
  if (!businessId) {
    return null
  }

  const reviewData = {
    count: null,
    averageRating: null
  }

  await Promise.all([
    reviewData.count = await getReviewCount(businessId),
    reviewData.averageRating = await getAvgRating(businessId)
  ])

  return reviewData
}

async function getReviewCount (businessId) {
  const reviewCount = await BusinessReview.find({
    businessId: businessId,
    active: true
  }).countDocuments()
  return reviewCount || 0
}

async function getAvgRating (businessId) {
  const ratings = await BusinessReview.aggregate([{
    $match: {
      businessId: Mongoose.Types.ObjectId(businessId),
      active: true
    }
  }, {
    $group: {
      _id: '$businessId',
      averageRating: {
        $avg: '$rating'
      }
    }
  }])

  if (ratings[0]) {
    return ratings[0].averageRating || null
  } else {
    return null
  }
}

module.exports = router
