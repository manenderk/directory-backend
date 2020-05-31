const express = require('express')
const router = express.Router()
const BusinesImage = require('@models/business/business-image.model')
const config = require('@root/config')
const uploader = require('@root/utils/file-uploader')(config.uploadDirectories.businessImage, 'images', 'array', 5)

router.get('/', async (req, res, next) => {
  try {
    const images = await BusinesImage.find()
    res.status(200).json(images)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.get('/business-id/:id', async (req, res, next) => {
  try {
    const images = await BusinesImage.find({ businessId: req.params.id })
    res.status(200).json(images)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.post(
  '/',
  uploader,
  async (req, res, next) => {
    try {
      await Promise.all(
        req.files.map(async file => {
          const businessImage = new BusinesImage({
            businessId: req.body.businessId,
            image: config.uploadDirectories.businessImage + '/' + file.filename
          })
          await businessImage.save()
        })
      )
      res.sendStatus(200)
    } catch (e) {
      res.sendStatus(500).json(e)
    }
  }
)

router.delete('/:id', async (req, res, next) => {
  try {
    await BusinesImage.findByIdAndDelete(req.params.id)
    res.sendStatus(200)
  } catch (e) {
    res.status(500).json(e)
  }
})

module.exports = router
