const mongoose = require('mongoose')

const BusinessImageSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  image: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('BusinessImage', BusinessImageSchema)
