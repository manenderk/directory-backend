const express = require('express')
const Router = express.Router()
const BusinessMenuMap = require('@models/restaurant/business-menu-map.model')

Router.post('/', async (req, res, next) => {
  try {
    const map = new BusinessMenuMap({
      businessId: req.body.businessId,
      menuId: req.body.menuId
    })
    const savedMap = map.save()
    res.status(201).json(savedMap)
  } catch (e) {
    res.status(500).json(e)
  }
})

module.exports = Router
