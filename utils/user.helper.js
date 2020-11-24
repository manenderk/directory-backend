const User = require('@models/user/user.model')
const Crypto = require('crypto')

module.exports = {
  addUser: async (email, firstName, lastName, active = false, password = null) => {
    if (!email || !firstName) {
      return null
    }

    email = email.toString().trim().toLowerCase()
    firstName = firstName.toString().trim()

    if (lastName) {
      lastName = lastName.toString().trim()
    }

    const user = new User({
      email: email,
      firstName: firstName,
      lastName: lastName,
      active: active
    })
    if (!password) {
      password = Crypto.randomBytes(16).toString('base64').slice(0, 16)
    }
    user.setPassword()
    await user.save()
    return user
  }
}
