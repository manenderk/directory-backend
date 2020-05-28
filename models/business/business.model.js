const mongoose = require('mongoose')

const BusinessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  addressLine1: {
    type: String,
    required: true
  },
  addressLine2: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  country: {
    type: String
  },
  zipcode: {
    type: String
  },
  contactNumber: {
    type: String,
    required: true
  },
  alternateContactNumber: {
    type: String
  },
  email: {
    type: String
  },
  alternateEmail: {
    type: String
  },
  longitude: {
    type: Number
  },
  langitude: {
    type: Number
  },
  ownerNotes: {
    type: String
  },
  startDate: {
    type: Date
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
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
