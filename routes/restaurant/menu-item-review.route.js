const express = require('express')
const router = express.Router()
const MenuItemReview = require('@models/restaurant/menu-item-review.model')

router.get('/menu-item-id/:itemId', async (req, res, next) => {
  try {
    const reviews = await MenuItemReview.find({
      menuItemId: req.params.itemId
    })
    res.status(200).json(reviews)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const review = await MenuItemReview.findById(req.params.id)
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
    const review = new MenuItemReview({
      menuItemId: req.body.menuItemId,
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
    const updatedReview = MenuItemReview.findByIdAndUpdate(
      req.params.id,
      {
        menuItemId: req.body.menuItemId,
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
    await MenuItemReview.findByIdAndDelete(req.params.id)
    res.sendStatus(200)
  } catch (e) {
    res.sendStatus(500).json(e)
  }
})

module.exports = router
