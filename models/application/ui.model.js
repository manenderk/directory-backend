const mongoose = require('mongoose')

const UISchema = new mongoose.Schema({
  key: {
    type: String,
    required: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('UI', UISchema)
