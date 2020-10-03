const express = require('express')
const router = express.Router()
const Media = require('@models/application/media.model')
const config = require('@root/config')
const base64Img = require('base64-img')
const path = require('path')
const uploader = require('@root/utils/file-uploader')(config.uploadDirectory, 'file')

router.post('/upload', uploader, async (req, res, next) => {
  try {
    const media = new Media({
      fileType: req.body.fileType,
      fileName: req.body.fileName,
      ratio: req.body.ratio
    })

    if (req.file) {
      media.path = config.uploadDirectory + '/' + req.file.filename
      await media.save()
      res.status(201).json(media)
    } else if (req.body.fileBase64) {
      const fileName = Date.now() + req.body.fileName.toLowerCase().split(' ').join('-')
      const pathName = config.projectRoot + path.sep + 'public' + path.sep + 'uploads'
      base64Img.img(req.body.fileBase64, pathName, fileName, async (err, filepath) => {
        if (err) {
          throw (err)
        }
        if (filepath) {
          media.path = config.uploadDirectory + '/' + filepath.split(path.sep).pop()
          await media.save()
          res.status(201).json(media)
        } else {
          const message = {
            message: 'file path not found'
          }
          res.status(500).json(message)
        }
      })
    } else {
      const message = {
        message: 'file not found'
      }
      res.status(400).json(message)
    }
  } catch (e) {
    res.status(500).json(e)
  }
})

router.get('/', async (req, res, next) => {
  try {
    const filters = {}
    if (req.query.name) {
      filters.fileName = { $regex: new RegExp(req.query.name, 'i') }
    }
    if (req.query.ratio) {
      const ratio = parseInt(req.query.ratio)
      if (ratio && !isNaN(ratio)) {
        filters.ratio = ratio
      }
    }

    const medias = await Media.find(filters).sort({ createdAt: -1 })
    res.status(200).json(medias)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    if (!req.params.id) {
      res.status(400)
    } else {
      const media = await Media.findById(req.params.id)
      res.status(200).json(media)
    }
  } catch (e) {
    res.status(500).json(e)
  }
})
module.exports = router
