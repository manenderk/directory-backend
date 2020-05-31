const mongoose = require('mongoose')

const MenuItemSchema = new mongoose.Schema({
  menuCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuCategory',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  isVeg: {
    type: Boolean
  },
  thumbnail: {
    type: String
  },
  price: {
    type: String
  },
  active: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timeStamps: true
})

module.exports = mongoose.model('MenuItem', MenuItemSchema)
