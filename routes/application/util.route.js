const express = require('express')
const router = express.Router()
const config = require('@root/config')
const csvjson = require('csvjson')
const fs = require('fs')
const Category = require('@models/category/category.model')
const GetNumber = require('@utils/get-number')
const Business = require('@models/business/business.model')

router.get('/', async (req, res, next) => {
  try {
    let categories = await Category.find().sort({
      createdAt: 1
    })
    let i = 1
    categories.forEach(async cat => {
      cat.number = i
      i++
      await Category.findByIdAndUpdate(cat._id, cat)
    })
    categories = await Category.find().sort({
      createdAt: 1
    })
    res.status(200).json(categories)
  } catch (error) {
    res.status(500).json(error)
  }
})

router.get('/single', async (req, res, next) => {
  try {
    const number = await GetNumber(Category)
    res.status(200).json(number)
  } catch (error) {
    res.status(500).json(error)
  }
})

router.get('/export/:entity', async (req, res, next) => {
  try {
    let records = null
    const entity = req.params.entity

    if (entity === 'categories') {
      records = await Category.find().sort('number')
    }

    const csvData = csvjson.toCSV(JSON.stringify(records), {
      headers: 'key'
    })
    const fileName = entity + Date.now() + '.csv'
    const uploadPath = config.exportFilesDirectory + '/' + fileName
    const fullPath = 'public' + uploadPath
    fs.writeFileSync(fullPath, csvData)
    const obj = {
      file: uploadPath
    }
    res.status(200).json(obj)
  } catch (error) {
    res.status(500).json(error)
  }
})

router.get('/test', async (req, res, next) => {
  try {
    /*  const data = await BusinessReview.aggregate([
    {
      $group: {
        _id: '$businessId',
        avg: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]) */
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

    let sort = {}
    if (req.query.sortBy === 'distance') {
      sort.distance = 1
    } else if (req.query.sortBy === 'name') {
      sort = { 'business.name': 1 }
    } else if (req.query.sortBy === 'rating') {
      // eslint-disable-next-line quote-props
      sort = { 'averageRating': -1 }
    } else {
      sort = { 'business.name': 1 }
    }

    const distanceFilters = {
      lat: parseFloat(req.query.lat),
      lng: parseFloat(req.query.lng),
      distance: parseFloat(req.query.distance)
    }

    const data = await Business.aggregate([
      [
        {
          $geoNear: {
            near: { type: 'Point', coordinates: [distanceFilters.lat, distanceFilters.lng] },
            distanceField: 'distance',
            query: filters,
            maxDistance: distanceFilters.distance,
            spherical: true
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
            business: {
              $first: '$$ROOT'
            },
            averageRating: {
              $avg: '$reviews.rating'
            },
            count: {
              $sum: 1
            }
          }
        }, {
          $sort: sort
        }
      ]
    ])
    res.status(200).json(data)
  } catch (e) {
    console.log('Error')
    console.log(e)
    res.status(500).json(e)
  }
})

module.exports = router
