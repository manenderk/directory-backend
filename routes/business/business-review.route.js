const express = require('express')
const router = express.Router()
const BusinessReview = require('@models/business/business-review.model')

router.get('/business-id/:itemId', async (req, res, next) => {
  try {
    const reviews = await BusinessReview.find({
      businessId: req.params.itemId
    })
    res.status(200).json(reviews)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const review = await BusinessReview.findById(req.params.id)
    if (!review) {
      res.sendStatus(404)
    } else {
      res.status(200).json(review)
    }
  } catch (e) {
    res.status(500).json(e)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const review = new BusinessReview({
      businessId: req.body.businessId,
      rating: req.body.rating,
      comment: req.body.comment,
      ratedBy: req.body.ratedBy,
      active: req.body.active,
      featured: req.body.featured
    })
    const savedReview = await review.save()
    res.status(201).json(savedReview)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const updatedReview = BusinessReview.findByIdAndUpdate(
      req.params.id,
      {
        businessId: req.body.businessId,
        rating: req.body.rating,
        comment: req.body.comment,
        ratedBy: req.body.ratedBy,
        active: req.body.active,
        featured: req.body.featured
      },
      {
        new: true
      }
    )
    res.status(200).json(updatedReview)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await BusinessReview.findByIdAndDelete(req.params.id)
    res.sendStatus(200)
  } catch (e) {
    res.sendStatus(500).json(e)
  }
})

module.exports = router
