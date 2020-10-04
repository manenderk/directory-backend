const mongoose = require('mongoose')

const PersonSchema = new mongoose.Schema({
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  email: {
    type: String
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Person', PersonSchema)
