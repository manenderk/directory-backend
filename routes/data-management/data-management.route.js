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
const { BadRequestError, handleError } = require('../../utils/errors')
const importCategories = require('./import/import-category')
require('dotenv').config()

router.get('/get-csv/:entity', async (req, res, next) => {
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

    const fileName = entity + Date.now() + '.csv'
    const uploadPath = config.exportFilesDirectory + '/' + fileName
    const fullPath = 'public' + uploadPath
    fs.writeFileSync(fullPath, csvData)
    const obj = {
      file: uploadPath
    }
    res.status(200).json(obj)
  } catch (error) {
    handleError(error, res)
  }
})

router.delete('/delete-collection/:entity', async (req, res, next) => {
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

router.post('/import/:entity', async (req, res, next) => {
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
        break
      case 'event':
        break
      case 'news':
        break
      default:
        throw new BadRequestError('Invalid Entity')
    }

    res.status(200).json({ message: 'success' })
  } catch (error) {
    handleError(error, res)
  }
})

module.exports = router
