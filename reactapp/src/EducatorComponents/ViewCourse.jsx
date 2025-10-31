import React, { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { deleteCourse, getAllCourses } from '../apiConfig'
import Tabel from '../Components/Utilities/Table'
import { toMonthDayYear } from '../utilities/date'
import { useNavigate } from 'react-router-dom'
import ConfirmModal from '../Components/Utilities/ConfirmModal'
import Pagination from '../Components/Utilities/Pagination'

function StudentViewCourse() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const [searchKey, setSearchKey] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filter, setFilter] = useState('')
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    setPage(1);
  }, [filter, searchKey]);

  const { data, isLoading } = useQuery({
    queryKey: ['courses', searchKey, page, filter],
    queryFn: () => getAllCourses({
      search: searchKey,
      page: page,
      limit: limit,
      filter: filter,
      sortBy: { createdAt: -1 }
    }),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    placeholderData: (prev) => prev
  })

  const handleAddMaterial = (courseId) => {
    navigate(`/educator/materials/add/${courseId}`);
  };

  const handleViewMaterial = (courseId) => {
    navigate(`/educator/materials/${courseId}`, { state: { courseId } });
  };

  const handleDeleteConfirm = async () => {
    if (!courseToDelete?._id) return;

    setIsDeleting(true);
    try {
      await deleteCourse(courseToDelete._id);
      setShowDeleteModal(false);
      setCourseToDelete(null);
      queryClient.invalidateQueries(['courses'])
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting course');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setCourseToDelete(null);
  };

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const handleEdit = (course) => {
    navigate(`/educator/courses/edit/${course._id}`, { state: { course } });
  };

  const handleSearch = (e) => {
    setSearchKey(e.target.value);
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
  };

  const getLevelBadgeClass = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'badge badge-success';
      case 'intermediate':
        return 'badge badge-warning';
      case 'advanced':
        return 'badge badge-error';
      default:
        return 'badge badge-ghost';
    }
  };

  const renderCourses = (course, idx) => (
    <tr key={course._id} className="hover">
      <td>
        <div className="font-semibold text-gray-900">{(page - 1) * limit + idx + 1}</div>
      </td>
      <td>
        <div className="font-semibold text-gray-900">{course.title}</div>
      </td>
      <td>
        <div className="text-gray-600 max-w-xs truncate">{course.description}</div>
      </td>
      <td>
        <span className="text-gray-700">{course.category}</span>
      </td>
      <td>
        <span className={getLevelBadgeClass(course.level)}>{course.level}</span>
      </td>
      <td className="text-gray-600">{toMonthDayYear(course.courseStartDate)}</td>
      <td className="text-gray-600">{toMonthDayYear(course.courseEndDate)}</td>
      <td>
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => handleEdit(course)}
            disabled={isDeleting}
            className="btn btn-sm btn-ghost"
            title="Edit Course"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => handleDeleteClick(course)}
            disabled={isDeleting}
            className="btn btn-sm btn-error btn-ghost"
            title="Delete Course"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-sm btn-ghost">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52">
              <li>
                <button onClick={() => handleAddMaterial(course._id)}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Material
                </button>
              </li>
              <li>
                <button onClick={() => handleViewMaterial(course._id)}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Materials
                </button>
              </li>
            </ul>
          </div>
        </div>
      </td>
    </tr>
  );

  const headers = [
    { label: 'SrNo', align: 'left' },
    { label: 'Course Title', align: 'left' },
    { label: 'Course Description', align: 'left' },
    { label: 'Category', align: 'left' },
    { label: 'Level', align: 'left' },
    { label: 'Start Date', align: 'left' },
    { label: 'End Date', align: 'center' },
    { label: 'Actions', align: 'center' }
  ]

  return (
    <div className='min-h-screen bg-base-200'>
      <div className="bg-base-100 border-b border-base-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
              <p className="mt-1 text-sm text-gray-500">
                {searchKey ? `Search results for "${searchKey}"` : 'All courses'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="badge badge-warning badge-lg">
                {data?.totalCourses || 0} Total
              </div>
              <button
                onClick={() => navigate('/educator/courses/add')}
                className="btn btn-primary"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Course
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Custom Search and Filter for Course Levels */}
        <div className="card bg-base-100 shadow-lg mb-6">
          <div className="card-body">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="form-control flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by course title..."
                    className="input input-bordered w-full pl-10"
                    value={searchKey}
                    onChange={handleSearch}
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="form-control sm:w-48">
                <select
                  className="select select-bordered w-full"
                  value={filter}
                  onChange={handleFilter}
                >
                  <option value="">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <Tabel
                loading={isLoading}
                data={data?.courses || []}
                headers={headers}
                renderRow={renderCourses}
              />
            </div>

            <Pagination totalPage={data?.totalPages} currPage={page} changePage={setPage} />

            {/* No results message */}
            {!isLoading && data?.courses?.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchKey ? `No courses found for "${searchKey}"` : 'No courses available'}
              </div>
            )}
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <ConfirmModal
          message={`Are you sure you want to delete "${courseToDelete?.title}"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          confirmText={isDeleting ? "Deleting..." : "Yes, Delete"}
          cancelText="Cancel"
          isLoading={isDeleting}
        />
      )}

      <span style={{ display: 'none' }}>Logout</span>
    </div>
  )
}

export default StudentViewCourse