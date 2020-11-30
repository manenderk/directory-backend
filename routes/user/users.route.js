const express = require('express')
const router = express.Router()
const User = require('@models/user/user.model')
const UserHelper = require('@utils/user.helper')
const { handleError } = require('../../utils/errors')

// GET ALL USERS
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json(error)
  }
})

// GET SINGLE USER
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (user) {
      res.status(200).json(user)
    } else {
      res.sendStatus(404)
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

router.post('/register', async (req, res, next) => {
  try {
    const user = await UserHelper.addUser(req.body.email, req.body.firstName, req.body.lastName, false, 'external', req.body.password)
    res.status(201).json(user)
  } catch (error) {
    handleError(error, res)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const user = new User({
      _id: req.params.id,
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      email: req.body.email,
      active: req.body.active
    })
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      user, {
        new: true
      }
    )
    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(500).json(error)
  }
})

router.post('/reset-password/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      res.status(404).json({
        message: 'Not found'
      })
      return
    }
    user.setPassword(req.body.password)
    await User.findByIdAndUpdate(
      user._id,
      user
    )
    res.status(200).json({
      message: 'Success'
    })
  } catch (error) {
    res.status(500).json(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.sendStatus(200)
  } catch (e) {
    res.status(500).json(e)
  }
})

module.exports = router
