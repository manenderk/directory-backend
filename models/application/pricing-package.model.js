const mongoose = require('mongoose')

const PricingPackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  features: [{
    type: String
  }]
}, {
  timestamps: true
})

module.exports = mongoose.model('PricingPackage', PricingPackageSchema)
