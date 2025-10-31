const express = require('express');
const { getEnrollmentById, getEnrollmentsByUserId, getEnrollmentsByCourseId, updateEnrollment, deleteEnrollment, addEnrollment, getAllEnrollments, rejectEnrollment, getEnrollmentByIdV2 } = require('../controllers/enrollmentController');
const { validateRole } = require('../authUtils');
const router = express.Router();

router.post('/:id', rejectEnrollment)
router.get('/', validateRole('educator'), getAllEnrollments);
router.get('/:id', validateRole('educator', 'student'), getEnrollmentByIdV2);
router.get('/user/:userId', validateRole('educator', 'student'), getEnrollmentsByUserId);
router.get('/course/:courseId', getEnrollmentsByCourseId);
router.put('/:id', validateRole('educator'), updateEnrollment);
router.delete('/:id', validateRole('educator'), deleteEnrollment);
router.post('/', validateRole('student'), addEnrollment);

module.exports = router;