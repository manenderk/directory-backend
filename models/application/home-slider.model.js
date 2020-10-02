const mongoose = require('mongoose')

const HomeSliderSchema = new mongoose.Schema({
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media',
    required: true
  },
  link: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('HomeSlider', HomeSliderSchema)
