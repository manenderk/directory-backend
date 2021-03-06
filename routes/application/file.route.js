const express = require('express')
const router = express.Router()
const config = require('../../config')
const jwtAuth = require('../../auth/jwt-auth')
const { handleError } = require('../../utils/errors')
const accessAuth = require('../../auth/access-auth')
const uploader = require('../../utils/file-uploader')(config.uploadDirectory, 'file')

router.post('/upload', jwtAuth, accessAuth(['admin']), uploader, async (req, res, next) => {
  try {
    const fileName = config.uploadDirectory + '/' + req.file.filename
    res.status(201).write(fileName)
  } catch (e) {
    handleError(e, res)
  }
})

module.exports = router
