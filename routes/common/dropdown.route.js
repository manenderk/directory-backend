const express = require('express')
const Router = express.Router()
const BusinessType = require('@models/business/business-type.model.js')

Router.get('/options/:optionType', async (req, res, next) => {
  try {
    let options = []
    const optionType = req.params.optionType
    if (optionType === 'businessType') {
      const businessTypes = await BusinessType.find()
      options = businessTypes.map(businessType => {
        return {
          key: businessType._id,
          label: businessType.name
        }
      })
    }
    res.status(200).json(options)
  } catch (e) {
    res.status(500).json(e)
  }
})

module.exports = Router
