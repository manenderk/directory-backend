const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema(
  {
    number: { type: Number, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    description: { type: String },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media'
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 100 }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Category', CategorySchema)
