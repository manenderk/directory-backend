const express = require('express')
const accessAuth = require('../../auth/access-auth')
const jwtAuth = require('../../auth/jwt-auth')
const router = express.Router()
const Person = require('../../models/application/person.model')
const { handleError } = require('../../utils/errors')

router.get('/', async (req, res, next) => {
  try {
    const persons = await Person.find().populate('image')
    res.status(200).json(persons)
  } catch (e) {
    handleError(e, res)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id).populate('image')
    res.status(200).json(person)
  } catch (e) {
    handleError(e, res)
  }
})

router.post('/', jwtAuth, accessAuth, async (req, res, next) => {
  try {
    let person = new Person({
      image: req.body.image,
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email
    })
    await person.save()
    person = await Person.findById(person._id).populate('image')
    res.status(201).json(person)
  } catch (e) {
    handleError(e, res)
  }
})

router.put('/:id', jwtAuth, accessAuth, async (req, res, next) => {
  try {
    let person = new Person({
      _id: req.body.id,
      image: req.body.image,
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email
    })
    await Person.findByIdAndUpdate(
      req.params.id,
      person
    )
    person = await Person.findById(person._id).populate('image')
    res.status(200).json(person)
  } catch (e) {
    handleError(e, res)
  }
})

router.delete('/:id', jwtAuth, accessAuth, async (req, res, next) => {
  try {
    await Person.findByIdAndDelete(req.params.id)
    res.status(200).json('')
  } catch (e) {
    handleError(e, res)
  }
})

module.exports = router
