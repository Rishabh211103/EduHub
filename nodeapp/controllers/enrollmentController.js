const Enrollment = require('../models/enrollmentModel');

async function getAllEnrollments(req, res) {
  try {

    const enrollments = await Enrollment.find()
      .populate('userId', 'userName email mobile')
      .populate('courseId', 'title category level');

    return res.status(200).json({ enrollments: enrollments.filter(item => item.courseId) });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Get enrollments by course ID (for educator to see who enrolled)
async function getEnrollmentsByCourseId(req, res) {
  try {
    const { courseId } = req.params;

    const enrollments = await Enrollment.find({ courseId })
      .populate('userId', 'userName email mobile');

    if (!enrollments || enrollments.length === 0) {
      return res.status(404).json({ message: 'No enrollments found for this course' });
    }

    return res.status(200).json(enrollments);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Get enrollment by ID
async function getEnrollmentById(req, res) {
  try {
    const { id } = req.params;

    const enrollment = await Enrollment.findById(id)

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    return res.status(200).json(enrollment);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Get enrollment by ID V2
async function getEnrollmentByIdV2(req, res) {
  try {
    const { id } = req.params;

    const enrollment = await Enrollment.findById(id)
      .populate('userId', 'userName email')
      .populate('courseId', 'title description');

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    return res.status(200).json(enrollment);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Get enrollments by user ID (student's enrolled courses)
async function getEnrollmentsByUserId(req, res) {
  try {
    const { userId } = req.params;

    const enrollments = await Enrollment.find({ userId })
      .populate('courseId', 'title description courseStartDate courseEndDate category level');

    return res.status(200).json({ enrollments: enrollments.filter(item => item.courseId) });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Add enrollment (student enrolls in course)
async function addEnrollment(req, res) {
  try {
    const enrollmentData = {
      userId: req.body.userId,
      courseId: req.body.courseId,
      enrollmentDate: new Date(),
      status: 'Pending'  // Default status
    };

    // Check if already enrolled
    const existing = await Enrollment.findOne({
      userId: enrollmentData.userId,
      courseId: enrollmentData.courseId
    });

    if (existing) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const newEnrollment = await Enrollment.create(enrollmentData);

    return res.status(200).json({
      message: 'Enrollment request submitted successfully',
      enrollment: newEnrollment
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Update enrollment (educator approves/rejects)
async function updateEnrollment(req, res) {
  try {
    const { id } = req.params;

    const updatedEnrollment = await Enrollment.findByIdAndUpdate(
      id,
      { status: req.body.status },
      { new: true }
    ).populate('userId', 'userName email')
      .populate('courseId', 'title');

    if (!updatedEnrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    return res.status(200).json({
      message: 'Enrollment status updated successfully',
      enrollment: updatedEnrollment
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// Delete enrollment (unenroll)
async function deleteEnrollment(req, res) {
  try {
    const { id } = req.params;

    const deleted = await Enrollment.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    return res.status(200).json({ message: 'Unenrolled successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function rejectEnrollment(req, res) {
  try {
    const { id } = req.params
    const { message, status } = req.body

    await Enrollment.findByIdAndUpdate(id, {
      status: status,
      message: message
    })
    res.status(200).json({ message: 'Rejected request successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getAllEnrollments,
  getEnrollmentsByCourseId,
  getEnrollmentById,
  getEnrollmentByIdV2,
  getEnrollmentsByUserId,
  addEnrollment,
  updateEnrollment,
  deleteEnrollment,
  rejectEnrollment
};