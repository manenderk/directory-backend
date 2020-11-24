const mongoose = require('mongoose')
const crypto = require('crypto')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  middleName: {
    type: String
  },
  lastName: {
    type: String
  },
  active: {
    type: Boolean,
    default: false
  },
  profileImage: {
    type: String
  },
  role: {
    type: String,
    default: 'external'
  },
  hash: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

UserSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.password
    return ret
  }
})

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = getHash(password, this.salt)
}

UserSchema.methods.validPassword = function (password) {
  var hash = getHash(password, this.salt)
  return this.hash === hash
}

function getHash (password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
}

module.exports = mongoose.model('User', UserSchema)
