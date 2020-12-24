const express = require('express')
const router = express.Router()
const UI = require('../../models/application/ui.model')
const jwtAuth = require('../../auth/jwt-auth')
const accessAuth = require('../../auth/access-auth')

router.get('/get-customizations', async (req, res, next) => {
  try {
    const customizations = await UI.find()
    res.status(200).json(customizations)
  } catch (error) {
    res.status(500).json(error)
  }
})

router.put('/update-customization', jwtAuth, accessAuth(['admin']), async (req, res, next) => {
  try {
    const key = req.body.key
    const value = req.body.value

    const existingcustomization = await UI.findOne({
      key: key
    })

    if (existingcustomization && existingcustomization._id) {
      existingcustomization.value = value
      const customization = await UI.findByIdAndUpdate(
        existingcustomization._id,
        existingcustomization,
        { new: true }
      )
      res.status(200).json(customization)
    } else {
      const customization = new UI({
        key: key,
        value: value
      })
      await customization.save()
      res.status(200).json(customization)
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router
