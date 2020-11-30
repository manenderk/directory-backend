const User = require('@models/user/user.model')
const Crypto = require('crypto')
const { DuplicateRecordError } = require('./errors')

module.exports = {
  addUser: async (email, firstName, lastName, active = false, role = 'external', password = null) => {
    if (!email || !firstName) {
      return null
    }

    email = email.toString().trim().toLowerCase()

    const existingUser = await User.findOne({ email: email })
    if (existingUser) {
      throw new DuplicateRecordError('User already exists with this email')
    }

    firstName = firstName.toString().trim()

    if (lastName) {
      lastName = lastName.toString().trim()
    }

    const user = new User({
      email: email,
      firstName: firstName,
      lastName: lastName,
      active: active,
      role: role
    })
    if (!password) {
      password = Crypto.randomBytes(16).toString('base64').slice(0, 16)
    }
    user.setPassword(password)
    await user.save()
    return user
  }
}
