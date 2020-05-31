const express = require('express')
const router = express.Router()
const User = require('@models/user/user.model')
const bcrypt = require('bcrypt')

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

router.post('/', async (req, res, next) => {
  try {
    var password = ''
    if (req.body.password) {
      password = await bcrypt.hash(req.body.password, 10)
    }
    const user = new User({
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: password,
      active: req.body.active
    })
    await user.save()
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json(error)
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
      user,
      { new: true }
    )
    res.status(200).json(updatedUser)
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
