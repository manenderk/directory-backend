const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const BusinessTypeModel = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        thumbnail: { type: String },
        parentBusinessTypeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BusinessType',
        },
        featured: { type: Boolean, default: false},
        active: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('BusinessType', BusinessTypeModel);
