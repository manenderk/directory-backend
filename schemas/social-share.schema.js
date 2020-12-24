const mongoose = require('mongoose')

const SocialShare = new mongoose.Schema({
  platform: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  }
})

module.exports = SocialShare
