const express = require('express')
const router = express.Router()
const config = require('../../config')
const csvjson = require('csvjson')
const fs = require('fs')
const Category = require('../../models/category/category.model')
const GetNumber = require('../../utils/get-number')

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

module.exports = router
