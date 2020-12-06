const express = require('express')
const router = express.Router()
const UserHelper = require('../../utils/user.helper')
const BusinessReview = require('../../models/business/business-review.model')
const User = require('../../models/user/user.model')
const jwtAuth = require('../../auth/jwt-auth')
const { handleError } = require('../../utils/errors')

router.get('/all', async (req, res, next) => {
  try {
    const reviews = await BusinessReview.find().populate('businessId', 'name')
    res.status(200).json(reviews)
  } catch (error) {
    handleError(error, res)
  }
})

router.get('/pending-reviews', jwtAuth, async (req, res, next) => {
  try {
    const reviews = await BusinessReview.find({
      active: false
    }).populate('business').sort('-createdAt')
    res.status(200).json(reviews)
  } catch (error) {
    handleError(error, res)
  }
})

router.get('/business-id/:id', async (req, res, next) => {
  try {
    const reviews = await BusinessReview.find({
      businessId: req.params.id,
      active: true
    }).sort({
      featured: -1, createdAt: -1
    })
    res.status(200).json(reviews)
  } catch (error) {
    handleError(error, res)
  }
})

router.get('/review-id/:id', async (req, res, next) => {
  try {
    const review = await BusinessReview.findById(req.params.id)
    res.status(200).json(review)
  } catch (error) {
    handleError(error, res)
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

      email = email.toString().trim().toLowerCase()

      let user = await User.findOne({
        email: email
      })
      if (!user || !user._id) {
        user = await UserHelper.addUser(email, firstName, lastName)
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
  } catch (error) {
    handleError(error, res)
  }
})

router.put('/update-review/:id', jwtAuth, async (req, res, next) => {
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
  } catch (error) {
    handleError(error, res)
  }
})

router.put('/moderate-review/:id', jwtAuth, async (req, res, next) => {
  try {
    await BusinessReview.findByIdAndUpdate(req.params.id, {
      active: req.body.active
    })
    res.status(200).json({
      status: 'success'
    })
  } catch (error) {
    handleError(error, res)
  }
})

router.delete('/:id', jwtAuth, async (req, res, next) => {
  try {
    await BusinessReview.findByIdAndDelete(req.params.id)
    res.sendStatus(200)
  } catch (error) {
    handleError(error, res)
  }
})

module.exports = router
