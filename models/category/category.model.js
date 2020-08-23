const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    thumbnail: { type: String },
    parentBusinessTypeId: {
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
