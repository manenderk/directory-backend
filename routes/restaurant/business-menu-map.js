const express = require('express')
const Router = express.Router()
const BusinessMenuMap = require('@models/restaurant/business-menu-map.model')

Router.get('/business-id/:businessId', async (req, res, next) => {
  try {
    const maps = BusinessMenuMap.find({
      businessId: req.params.businessId
    })
    res.status(200).json(maps)
  } catch (e) {
    res.status(500).json(e)
  }
})

Router.get('/menu-id/:menuId', async (req, res, next) => {
  try {
    const maps = BusinessMenuMap.find({
      menuId: req.params.menuId
    })
    res.status(200).json(maps)
  } catch (e) {
    res.status(500).json(e)
  }
})

Router.post('/', async (req, res, next) => {
  try {
    const map = new BusinessMenuMap({
      businessId: req.body.businessId,
      menuId: req.body.menuId,
      featured: req.body.featured,
      active: req.body.active
    })
    const savedMap = map.save()
    res.status(201).json(savedMap)
  } catch (e) {
    res.status(500).json(e)
  }
})

Router.put('/business-id/:businessId/menu-id/:menuId', async (req, res, next) => {
  try {
    const updatedMap = await BusinessMenuMap.findOneAndUpdate({
      businessId: req.params.businessId,
      menuId: req.params.menuId
    }, {
      featured: req.body.featured,
      active: req.body.active
    }, {
      new: true
    })
    res.status(200).json(updatedMap)
  } catch (e) {
    res.status(500).json(e)
  }
})

Router.delete('/business-id/:businessId/menu-id/:menuId', async (req, res, next) => {
  try {
    await BusinessMenuMap.deleteOne({
      businessId: req.params.businessId,
      menuId: req.params.menuId
    })
    res.sendStatus(200)
  } catch (e) {
    res.status(500).json(e)
  }
})

module.exports = Router
