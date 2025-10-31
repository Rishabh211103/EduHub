const express = require("express");
const { getAllCourses, getCourseById, addCourse, updateCourse, deleteCourse } = require("../controllers/courseController");
const { handlechat } = require("../controllers/chatController");
const { validateRole } = require("../authUtils");

const router = express.Router();

router.post('/all', getAllCourses);
router.get('/:id', getCourseById);
router.post('/', validateRole('educator'), addCourse);
router.put('/:id', validateRole('educator'), updateCourse);
router.delete('/:id', validateRole('educator'), deleteCourse);
router.post('/chat/:sessionId/:courseId', handlechat);

module.exports = router
module.exports = router