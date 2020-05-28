const mongoose = require('mongoose')

const MenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  thumbnail: {
    type: String
  },
  parentMenuId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu'
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

module.exports = mongoose.model('Menu', MenuSchema)
