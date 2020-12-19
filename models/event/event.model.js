const mongoose = require('mongoose')
// eslint-disable-next-line no-unused-vars
const GeoJSON = require('mongoose-geojson-schema')

const EventSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date
  },
  time: {
    type: Date
  },
  location: {
    type: String
  },
  priceRange: {
    type: String
  },
  description: {
    type: String
  },
  thumbnailImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media',
    required: true
  },
  bannerImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media',
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 1000
  },
  socialLinks: [{
    type: String
  }],
  eventImages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  }],
  presentedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  }],
  inAssociationWith: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  }],
  sponsors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  }],
  pricings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PricingPackage'
  }],
  ticketsLocations: [{
    type: String
  }],
  contacts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person'
  }],
  latLng: {
    type: mongoose.Schema.Types.Point
  }
}, {
  timestamps: true
})

EventSchema.index({
  latLng: '2dsphere'
})

module.exports = mongoose.model('Event', EventSchema)
