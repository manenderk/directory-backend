const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const BusinessReview = require('@models/business/business-review.model')
const User = require('@models/user/user.model')

router.get('/business-id/:id', async (req, res, next) => {
  try {
    const reviews = await BusinessReview.find({
      businessId: req.params.id,
      active: true
    }).sort({
      featured: -1, createdAt: -1
    })
    res.status(200).json(reviews)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.get('/review-id/:id', async (req, res, next) => {
  try {
    const review = await BusinessReview.findById(req.params.id)
    res.status(200).json(review)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.post('/add-review', async (req, res, next) => {
  try {
    let ratedBy = req.body.ratedBy
    if (!ratedBy) {
      const firstName = req.body.firstName
      const lastName = req.body.lastName
      let email = req.body.email
      if (!firstName || !email) {
        res.status(400).json({
          error: 'Insufficient Inputs'
        })
        return
      }

      email = email.toLowerCase()

      let user = await User.findOne({
        email: email
      })
      if (!user || !user._id) {
        user = new User({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: uuidv4(),
          active: true
        })
        await user.save()
      }
      ratedBy = user._id
    }

    const review = new BusinessReview({
      businessId: req.body.businessId,
      rating: req.body.rating,
      title: req.body.title,
      comment: req.body.comment,
      ratedBy: ratedBy,
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
        title: req.body.title,
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
