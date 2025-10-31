const mongoose = require('mongoose');
const { Schema } = mongoose;

const enrollmentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrollmentDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  message: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);