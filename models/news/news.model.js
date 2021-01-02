const mongoose = require('mongoose')

const NewsSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  thumbnailImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  },
  bannerImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  },
  body: {
    type: String,
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 1000
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('News', NewsSchema)
