const express = require('express')
const router = express.Router()
const config = require('../../config')
const jwtAuth = require('../../auth/jwt-auth')
const uploader = require('../../utils/file-uploader')(config.uploadDirectory, 'file')

router.post('/upload', jwtAuth, uploader, async (req, res, next) => {
  const fileName = config.uploadDirectory + '/' + req.file.filename
  res.status(201).write(fileName)
})

module.exports = router
