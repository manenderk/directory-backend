const express = require('express')
const router = express.Router()
const News = require('../../models/news/news.model')
const { handleError } = require('../../utils/errors')
const jwtAuth = require('../../auth/jwt-auth')
const GetNumber = require('../../utils/get-number')

router.get('/', async (req, res, next) => {
  try {
    const news = await News.find().select('-body').sort({ createdAt: -1 })
    res.status(200).json(news)
  } catch (error) {
    handleError(error, res)
  }
})

router.get('/id/:id', async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id).populate('bannerImage').populate('thumbnailImage')
    res.status(200).json(news)
  } catch (error) {
    handleError(error, res)
  }
})

router.get('/frontend', async (req, res, next) => {
  try {
    const news = await News.find({
      active: true
    }).sort({
      featured: -1, order: 1, createdAt: -1
    }).populate('thumbnailImage')
    res.status(200).json(news)
  } catch (e) {
    handleError(e, res)
  }
})

router.post('/', jwtAuth, async (req, res, next) => {
  try {
    let news = new News({
      number: await GetNumber(News),
      title: req.body.title,
      thumbnailImage: req.body.thumbnailImage,
      bannerImage: req.body.bannerImage,
      body: req.body.body,
      active: req.body.active,
      featured: req.body.featured,
      order: req.body.order
    })
    await news.save()
    news = await News.findById(news._id).populate('bannerImage').populate('thumbnailImage')
    res.status(201).json(news)
  } catch (error) {
    handleError(error, res)
  }
})

router.put('/id/:id', jwtAuth, async (req, res, next) => {
  try {
    let news = new News({
      _id: req.params.id,
      number: req.body.number,
      title: req.body.title,
      thumbnailImage: req.body.thumbnailImage,
      bannerImage: req.body.bannerImage,
      body: req.body.body,
      active: req.body.active,
      featured: req.body.featured,
      order: req.body.order
    })
    await News.findByIdAndUpdate(req.params.id, news)
    news = await News.findById(news._id).populate('bannerImage').populate('thumbnailImage')
    res.status(200).json(news)
  } catch (error) {
    handleError(error, res)
  }
})

router.put('/increse-view-count/:id', async (req, res, next) => {
  try {
    const news = News.findById(req.params.id)
    news.views++
    await News.findByIdAndUpdate(req.params.id, news)
    const resBody = {
      count: news.views
    }
    res.status(200).json(resBody)
  } catch (error) {
    handleError(error, res)
  }
})

module.exports = router
