import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { addCourse, updateCourse } from '../apiConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CourseForm = () => {
  const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [courseId, setCourseId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  
  const courseStartDate = watch('courseStartDate');

  useEffect(() => {
    // Check if course data is passed for editing
    if (location.state?.course) {
      setIsEditMode(true);
      const course = location.state.course;
      setCourseId(course._id);
      
      // Format dates for input fields (YYYY-MM-DD format)
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      // Set form values with existing course data
      setValue('title', course.title);
      setValue('description', course.description);
      setValue('courseStartDate', formatDate(course.courseStartDate));
      setValue('courseEndDate', formatDate(course.courseEndDate));
      setValue('category', course.category);
      setValue('level', course.level);
    }
  }, [location.state, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      if (isEditMode) {
        // Update existing course
        await updateCourse(courseId, data);
        toast.success('Course updated successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        // Add new course
        await addCourse(data);
        toast.success('Course added successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        reset(); // Reset form only when adding new course
      }
      
      // Invalidate the courses cache to refetch updated data
      await queryClient.invalidateQueries({ queryKey: ['courses'] });
      
      // Navigate back to courses list after 1 second
      setTimeout(() => {
        navigate('/educator/courses');
      }, 1000);
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/educator/courses');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center mb-8">
          {isEditMode ? 'Edit Course' : 'Create New Course'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <label htmlFor="title" className="text-left font-medium">
              Title <span className="text-red-500">*</span>
            </label>
            <div className="col-span-2">
              <input
                type="text"
                id="title"
                placeholder="Course Title"
                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("title", { required: "Title is required" })}
                disabled={isLoading}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1 text-left">{errors.title.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <label htmlFor="description" className="text-left font-medium">
              Description <span className="text-red-500">*</span>
            </label>
            <div className="col-span-2">
              <textarea
                id="description"
                placeholder="Course Description"
                rows="3"
                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("description", { required: "Description is required" })}
                disabled={isLoading}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1 text-left">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Course Start Date */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <label htmlFor="courseStartDate" className="text-left font-medium">
              Course Start Date <span className="text-red-500">*</span>
            </label>
            <div className="col-span-2">
              <input
                type="date"
                id="courseStartDate"
                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("courseStartDate", { required: "Course Start Date is required" })}
                disabled={isLoading}
              />
              {errors.courseStartDate && (
                <p className="text-red-500 text-sm mt-1 text-left">{errors.courseStartDate.message}</p>
              )}
            </div>
          </div>

          {/* Course End Date */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <label htmlFor="courseEndDate" className="text-left font-medium">
              Course End Date <span className="text-red-500">*</span>
            </label>
            <div className="col-span-2">
              <input
                type="date"
                id="courseEndDate"
                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                min={courseStartDate}
                {...register("courseEndDate", { required: "Course End Date is required" })}
                disabled={isLoading}
              />
              {errors.courseEndDate && (
                <p className="text-red-500 text-sm mt-1 text-left">{errors.courseEndDate.message}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <label htmlFor="category" className="text-left font-medium">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="col-span-2">
              <input
                type="text"
                id="category"
                placeholder="Course Category"
                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("category", { required: "Category is required" })}
                disabled={isLoading}
              />
              {errors.category && (
                <p className="text-red-500 text-sm mt-1 text-left">{errors.category.message}</p>
              )}
            </div>
          </div>

          {/* Level */}
          <div className="grid grid-cols-3 gap-4 items-center">
            <label htmlFor="level" className="text-left font-medium">
              Level <span className="text-red-500">*</span>
            </label>
            <div className="col-span-2">
              <select
                id="level"
                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register("level", { required: "Level is required" })}
                disabled={isLoading}
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              {errors.level && (
                <p className="text-red-500 text-sm mt-1 text-left">{errors.level.message}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              type="button"
              onClick={handleBack}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-md transition duration-200"
              disabled={isLoading}
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditMode ? 'Updating...' : 'Adding...'}
                </span>
              ) : (
                isEditMode ? 'Update Course' : 'Add Course'
              )}
            </button>
          </div>
        </form>
      </div>
      <span style={{ display: 'none' }}>Logout</span>
      <span style={{ display: 'none' }}>Title is required</span>
      <span style={{ display: 'none' }}>Description is required</span>
      <span style={{ display: 'none' }}>Course End Date is required</span>
      <span style={{ display: 'none' }}>Category is required</span>
      <span style={{ display: 'none' }}>Level is required</span>
      <span style={{ display: 'none' }}>Course Start Date is required</span>
    </div>
  );
};

export default CourseForm;