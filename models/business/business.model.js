const mongoose = require('mongoose')
// eslint-disable-next-line no-unused-vars
const GeoJSON = require('mongoose-geojson-schema')

const BusinessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  starRating: {
    type: Number
  },
  owner: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person'
  }],
  phone: {
    type: String
  },
  email: {
    type: String
  },
  latLng: {
    type: mongoose.Schema.Types.Point
  },
  website: {
    type: String
  },
  address: {
    type: String
  },
  description: {
    type: String
  },
  productsAndServices: {
    type: [String]
  },
  productsAndServicesImages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  }],
  specialities: {
    type: [String]
  },
  languagesSpoken: {
    type: [String]
  },
  openingHours: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OpeningHours'
  },
  paymentMethods: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  }],
  team: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person'
  }],
  thumbnailImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  },
  bannerImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  },
  images: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  }],
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Business', BusinessSchema)
