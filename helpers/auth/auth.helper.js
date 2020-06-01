const config = require('@root/config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

module.exports = {
  generateSignature: (user) => {
    console.log(user)
    const issueDate = new Date()
    const expiryDate = new Date(issueDate.getTime() + config.auth.expiresIn * 60 * 60 * 1000)
    const token = jwt.sign({
      iss: config.auth.issuer, // Issuer
      sub: user._id, // Subject
      iat: issueDate.getTime(), // Issue Date
      exp: expiryDate.getTime() // Current Time + 1 Day
    }, config.auth.secret)
    return {
      token,
      issueDate,
      expiryDate
    }
  },

  encryptPassword: (password) => {
    return new Promise((resolve, reject) => {
      bcrypt.hash(
        password,
        config.auth.bcryptIterations
      ).then(encryptedPassword => {
        console.log(encryptedPassword)
        resolve(encryptedPassword)
      }).catch(e => {
        reject(e)
      })
    })
  },

  comparePasswords: (plainPasswordToCheck, ecryptedPassword) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(
        plainPasswordToCheck,
        ecryptedPassword
      ).then(result => {
        resolve(result)
      }).catch(error => {
        reject(error)
      })
    })
  }
}
