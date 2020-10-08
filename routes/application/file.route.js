const express = require('express')
const router = express.Router()
const config = require('@root/config')
const uploader = require('@root/utils/file-uploader')(config.uploadDirectory, 'file')

router.post('/upload', uploader, async (req, res, next) => {
  const fileName = config.uploadDirectory + '/' + req.file.filename
  res.status(201).write(fileName)
})

module.exports = router
