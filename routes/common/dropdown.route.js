const express = require('express')
const Router = express.Router()
const Category = require('../../models/category/category.model.js')

Router.get('/options/:optionType', async (req, res, next) => {
  try {
    let options = []
    const optionType = req.params.optionType
    if (optionType === 'category') {
      const categorys = await Category.find()
      options = categorys.map(category => {
        return {
          key: category._id,
          label: category.name
        }
      })
    }
    res.status(200).json(options)
  } catch (e) {
    res.status(500).json(e)
  }
})

module.exports = Router
