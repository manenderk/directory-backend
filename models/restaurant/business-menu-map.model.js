const mongoose = require('mongoose')

const BusinessMenuMapSchema = mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business'
  },
  menuId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu'
  }
}, {
  timeStamps: true
})

module.exports = mongoose.model('BusinessMenuMap', BusinessMenuMapSchema)
