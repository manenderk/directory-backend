const { UnauthorizedError } = require('express-jwt')
const { handleError } = require('../utils/errors')
const auth = require('./auth')

function accessAuth (req, res, next) {
  try {
    if (!req[auth.verifiedRequestUserProperty] || !req[auth.verifiedRequestUserProperty]._id) {
      throw (UnauthorizedError())
    }
    console.log(req.authUser)
    next()
  } catch (error) {
    handleError(error, res)
  }
};

module.exports = accessAuth
