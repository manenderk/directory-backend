const { handleError, RoleAccessError } = require('../utils/errors')
const auth = require('./auth')
const User = require('../models/user/user.model')

module.exports = function (roles = ['admin']) {
  return function (req, res, next) {
    try {
      if (!req[auth.verifiedRequestUserProperty] || !req[auth.verifiedRequestUserProperty]._id) {
        throw new RoleAccessError('auth user not found')
      }
      const userId = req[auth.verifiedRequestUserProperty]._id
      User.findById(userId).then(user => {
        if (!user) {
          handleError(new RoleAccessError('user not found'), res)
        }
        if (roles.includes(user.role)) {
          next()
        } else {
          handleError(new RoleAccessError('access not allowed'), res)
        }
      }).catch(e => {
        handleError(e, res)
      })
    } catch (error) {
      handleError(error, res)
    }
  }
}
