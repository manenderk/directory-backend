const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    date: { type: Date },
    address: { type: String },
    description: { type: String },
    thumbnailImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media'
    },
    bannerImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media'
    },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 1000 },
    socialLinks: [{
      type: String
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
    }]
  }, {
    timestamps: true
  }
)

module.exports = mongoose.model('Event', EventSchema)
