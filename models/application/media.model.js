const mongoose = require('mongoose')

const MediaSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  ratio: {
    type: Number
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Media', MediaSchema)
