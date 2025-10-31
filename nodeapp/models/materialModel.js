const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Course'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now()
  },
  contentType: {
    type: String,
    required: true
  },
  file: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Material', MaterialSchema);