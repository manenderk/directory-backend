const express = require('express')
const router = express.Router()
const Person = require('@models/application/person.model')

router.get('/', async (req, res, next) => {
  try {
    const persons = await Person.find()
    res.status(200).json(persons)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id)
    res.status(200).json(person)
  } catch (error) {
    res.status(500).json(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const person = new Person({
      image: req.body.image,
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email
    })
    await person.save()
    res.status(201).json(person)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    let person = new Person({
      _id: req.body.id,
      image: req.body.image,
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email
    })
    person = await Person.findByIdAndUpdate(
      req.params.id,
      person,
      { new: true	}
    )
    res.status(200).json(person)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await Person.findByIdAndDelete(req.params.id)
    res.status(200).json('')
  } catch (e) {
    res.status(500).json(e)
  }
})

module.exports = router
