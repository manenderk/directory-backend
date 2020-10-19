const { Mongoose } = require('mongoose')
const mongoose = require('mongoose')

const openHourSchema = new Mongoose.Schema({
  open: {
    type: Boolean,
    default: false
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  }
})

const OpeningHoursSchema = new mongoose.Schema({
  monday: {
    type: openHourSchema
  },
  tuesday: {
    type: openHourSchema
  },
  wednesday: {
    type: openHourSchema
  },
  thursday: {
    type: openHourSchema
  },
  friday: {
    type: openHourSchema
  },
  saturday: {
    type: openHourSchema
  },
  sunday: {
    type: openHourSchema
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('OpeningHours', OpeningHoursSchema)
