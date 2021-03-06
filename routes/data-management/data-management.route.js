const express = require('express')
const router = express.Router()
const Category = require('../../models/category/category.model')
const Business = require('../../models/business/business.model')
const BusinessReview = require('../../models/business/business-review.model')
const OpeningHour = require('../../models/application/opening-hours.model')
const News = require('../../models/news/news.model')
const Event = require('../../models/event/event.model')
const PricingPackage = require('../../models/application/pricing-package.model')
const config = require('../../config')
const csvjson = require('csvjson')
const fs = require('fs')
const mkdirp = require('mkdirp')
const { BadRequestError, handleError, NotFoundError } = require('../../utils/errors')
const importCategories = require('./import/import-category')
const importBusinesses = require('./import/import-business')
const jwtAuth = require('../../auth/jwt-auth')
const accessAuth = require('../../auth/access-auth')
const importEvents = require('./import/import-event')
const copyBusiness = require('./copy/copy-business')
const copyEvent = require('./copy/copy-event')
const importNewss = require('./import/import-news')
const copyNews = require('./copy/copy-news')
require('dotenv').config()

router.get('/get-csv/:entity', jwtAuth, accessAuth(['admin']), async (req, res, next) => {
  try {
    const entity = req.params.entity
    let records = null

    switch (entity) {
      case 'category':
        records = await Category.find().sort('number')
        break
      case 'business':
        records = await Business.find().sort('number')
        break
      case 'event':
        records = await Event.find().sort('number')
        break
      case 'news':
        records = await News.find().sort('number')
        break
      default:
        throw new BadRequestError('Invalid Entity')
    }

    const csvData = csvjson.toCSV(JSON.stringify(records), {
      headers: 'key'
    })

    const fileName = entity + '.csv'
    const uploadPath = config.projectRoot + '/public/files'
    mkdirp.sync(uploadPath)
    fs.writeFileSync(uploadPath + '/' + fileName, csvData)
    const obj = {
      file: '/files/' + fileName
    }
    res.status(200).json(obj)
  } catch (error) {
    handleError(error, res)
  }
})

router.delete('/delete-collection/:entity', jwtAuth, accessAuth(['admin']), async (req, res, next) => {
  try {
    if (!process.env.APP_ENV || process.env.APP_ENV !== 'development') {
      throw new BadRequestError('Not Allowed')
    }

    const entity = req.params.entity

    switch (entity) {
      case 'category':
        await Category.deleteMany()
        break
      case 'business':
        await Business.deleteMany()
        await BusinessReview.deleteMany()
        await OpeningHour.deleteMany()
        break
      case 'event':
        await Event.deleteMany()
        await PricingPackage.deleteMany()
        break
      case 'news':
        await News.deleteMany()
        break
      default:
        throw new BadRequestError('Invalid Entity')
    }

    res.status(200).json({ message: 'success' })
  } catch (e) {
    handleError(e, res)
  }
})

router.post('/import/:entity', jwtAuth, accessAuth(['admin']), async (req, res, next) => {
  try {
    const data = req.body
    if (!data) {
      throw new BadRequestError('No data provided')
    }

    const entity = req.params.entity

    switch (entity) {
      case 'category':
        await importCategories(data)
        break
      case 'business':
        await importBusinesses(data)
        break
      case 'event':
        await importEvents(data)
        break
      case 'news':
        await importNewss(data)
        break
      default:
        throw new BadRequestError('Invalid Entity')
    }

    res.status(200).json({ message: 'success' })
  } catch (error) {
    handleError(error, res)
  }
})

router.put('/copy/:entity/:id', jwtAuth, accessAuth(['admin']), async (req, res, next) => {
  try {
    if (!req.params.id) {
      throw new BadRequestError('No record id provided')
    }

    const entity = req.params.entity

    switch (entity) {
      case 'category':
        // await importCategories(data)
        break
      case 'business':
        await copyBusiness(req.params.id)
        break
      case 'event':
        await copyEvent(req.params.id)
        break
      case 'news':
        await copyNews(req.params.id)
        break
      default:
        throw new BadRequestError('Invalid Entity')
    }

    res.status(200).json({ message: 'success' })
  } catch (error) {
    handleError(error, res)
  }
  try {
    const id = req.params.id
    const business = await Business.findById(id)
    if (!business) {
      throw new NotFoundError()
    }
    const businesses = await Business.find()
    for (const b of businesses) {
      b.bannerImage = business.bannerImage
      b.description = business.description
      b.images = business.images
      b.languagesSpoken = business.languagesSpoken
      b.openingHours = business.openingHours
      b.owner = business.owner
      b.paymentMethods = business.paymentMethods
      b.phone = business.phone
      b.productsAndServices = business.productsAndServicesImages
      b.productsAndServicesImages = business.productsAndServicesImages
      b.specialities = business.specialities
      b.team = business.team
      b.thumbnailImage = business.thumbnailImage
      await Business.findByIdAndUpdate(b._id, b)
    }
    res.status(200).json({ message: 'success' })
  } catch (error) {
    handleError(error, res)
  }
})

module.exports = router
