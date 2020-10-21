const express = require('express')
const router = express.Router()
const xlsx = require('xlsx')
const fs = require('fs')
const Category = require('@models/category/category.model')
const GetNumber = require('@utils/get-number')

router.get('/', async (req, res, next) => {
  try {
    let categories = await Category.find().sort({ createdAt: 1 })
    let i = 1
    categories.forEach(async cat => {
      cat.number = i
      i++
      await Category.findByIdAndUpdate(cat._id, cat)
    })
    categories = await Category.find().sort({ createdAt: 1 })
    res.status(200).json(categories)
  } catch (error) {
    res.status(500).json(error)
  }
})

router.get('/export/:collection', async (req, res, next) => {
  try {
    let records
    if (req.params.collection === 'category') {
      records = await Category.find().sort('number')
    }
    var newWB = xlsx.book_new()
    var newWS = xlsx.utils.json_to_sheet(records)
    xlsx.utils.book_append_sheet(newWB, newWS, req.params.collection)
    const filePath = '/files'
    const fileName = Date.now + req.params.fileName
    const completeFilePath = 'public' + filePath
    console.log(completeFilePath)
    if (!fs.existsSync(completeFilePath)) {
      fs.mkdirSync(completeFilePath)
    }
    xlsx.writeFile(newWB, completeFilePath + '/' + fileName)
    res.status(200).json({
      file: filePath + '/' + fileName
    })
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

module.exports = router
