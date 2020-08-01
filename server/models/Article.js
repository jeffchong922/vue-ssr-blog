const mongoose = require('mongoose')

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  tags: [
    {
      type: String,
      default: ''
    }
  ],
  content: {
    type: String,
    default: ''
  },
  created_time: {
    type: Number,
    default: +new Date()
  },
  updated_time: {
    type: Number,
    default: +new Date()
  }
})

module.exports = mongoose.model('Article', ArticleSchema)