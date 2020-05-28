const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  firstName: {
    type: String,
    required: true
  },
  middleName: {
    type: String
  },
  lastName: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
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

module.exports = mongoose.model('User', UserSchema)
