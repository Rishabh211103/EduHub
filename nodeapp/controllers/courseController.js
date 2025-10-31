const Course = require("../models/courseModel");

const getAllCourses = async (req, res) => {
    try {
        const { search, sortBy, page = 1, limit = 10, filter } = req.body;

        let searchQuery = {};
        if (search) {
            searchQuery = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            };
        }

        if (filter && filter.trim() !== '') {
            searchQuery.level = { $regex: `^${filter}$`, $options: 'i' };
        }

        let sortQuery = {};
        if (sortBy) {
            sortQuery = sortBy;
        }

        const skip = (page - 1) * limit;

        const courses = await Course.find(searchQuery)
            .sort(sortQuery)
            .skip(skip)
            .limit(Number(limit));

        const totalCourses = await Course.countDocuments(searchQuery);

        const totalPages = Math.ceil(totalCourses / limit);

        res.status(200).json({
            courses,
            totalCourses,
            currentPage: Number(page),
            totalPages
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const addCourse = async (req, res) => {
    try {
        await Course.create(req.body);
        res.status(200).json({ message: 'Course added successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findByIdAndUpdate(id, req.body, { new: true });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json({
            message: 'Course updated successfully',
            course
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findByIdAndDelete(id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllCourses,
    getCourseById,
    addCourse,
    updateCourse,
    deleteCourse
}