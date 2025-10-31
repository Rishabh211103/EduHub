import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getAllCourses, enrollInCourse, getUserEnrolledCourses } from '../apiConfig'
import Tabel from '../Components/Utilities/Table'
import { toMonthDayYear } from '../utilities/date'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Eye } from 'lucide-react'
import Pagination from '../Components/Utilities/Pagination'
function StudentViewCourse() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const [totalPage, setTotalPage] = useState(1)
  const [currPage, setCurrPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [showEnrollModal, setShowEnrollModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(null)

  const queryClient = useQueryClient()
  const { user } = useSelector((state) => state.users)

  const { data, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: getAllCourses,
  })

  const { data: enrolledData } = useQuery({
    queryKey: ['enrolledCourses', user?.id],
    queryFn: () => getUserEnrolledCourses(user.id),
    enabled: !!user?.id,
  })

  const courses = data?.courses || []
  const enrolledCourses = enrolledData?.enrollments || enrolledData || []

  const courseStatusMap = new Map()
  enrolledCourses.map(enrollment => courseStatusMap.set(enrollment?.courseId?._id, enrollment))
  const isEnrolled = (courseId) => {
    if (courseStatusMap.has(courseId)) {
      const enrollment = courseStatusMap.get(courseId)
      return enrollment.status
    }
  }

  const getEnrollmentMsg = (courseId) => {
    if (courseStatusMap.has(courseId)) {
      const enrollment = courseStatusMap.get(courseId)
      return enrollment.message
    }
  }

  const filteredCourses = courses.filter((course) => {
    const courseTitle = course.title || ''
    const courseCategory = course.category || ''
    const courseDescription = course.description || ''
    const matchesSearch =
      courseTitle.toLowerCase().includes(search.toLowerCase()) ||
      courseCategory.toLowerCase().includes(search.toLowerCase()) ||
      courseDescription.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'All' || course.category === filter
    return matchesSearch && matchesFilter
  })

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const totalPages = Math.ceil(filteredCourses?.length / limit)
  const paginatedData = filteredCourses.slice(startIndex, endIndex)

  // Get unique categories for filter
  const categories = ['All', ...new Set(courses.map(c => c.category).filter(Boolean))]

  const enrollMutation = useMutation({
    mutationFn: enrollInCourse,
    onSuccess: () => {
      toast.success('Successfully enrolled!')
      setShowEnrollModal(false)
      setSelectedCourse(null)
      queryClient.invalidateQueries(['enrolledCourses', user.id])
    },
    onError: (err) => {
      toast.error(err.message || 'Enrollment failed')
      setShowEnrollModal(false)
      setSelectedCourse(null)
    },
  })

  const handleEnrollClick = (course) => {
    if (isEnrolled(course._id)) {
      toast.info('You are already enrolled in this course')
      return
    }
    setSelectedCourse(course)
    setShowEnrollModal(true)
  }

  const handleConfirmEnroll = () => {
    if (!user || !selectedCourse) return
    enrollMutation.mutate({
      userId: user.id,
      courseId: selectedCourse._id,
      status: 'active',
      progress: 0,
    })
  }

  const renderCourses = (course, idx) => {
    const enrolled = isEnrolled(course._id)
    return (
      <tr key={course._id} className="hover">
        <td>
          <div className="font-semibold text-gray-900">{(page - 1) * limit + idx + 1}</div>
        </td>
        <td>
          <div className="font-medium text-gray-900">
            {course.title || 'N/A'}
          </div>
        </td>
        <td>
          <div className="text-gray-600 max-w-xs truncate">
            {course.description || 'N/A'}
          </div>
        </td>
        <td className="text-gray-600">
          {toMonthDayYear(course.courseStartDate)}
        </td>
        <td className="text-gray-600">
          {toMonthDayYear(course.courseEndDate)}
        </td>
        <td>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowDetailModal(course)}
              className="btn btn-sm btn-ghost btn-circle"
              title="View Details"
            >
              <Eye fontSize={12} />
            </button>
            <button
              className={`btn btn-sm ${enrolled ? 'btn-disabled' : 'btn-primary'} text-center`} // Removed 'flex-1'
              onClick={() => handleEnrollClick(course)}
              disabled={enrolled}
              title={enrolled ? enrolled : 'Enroll in course'}
            >
              {enrolled ? enrolled : 'Enroll'}
            </button>
          </div>
        </td>
      </tr>
    )
  }

  const headers = [
    { label: 'Sr No', align: 'left' },
    { label: 'Course Title', align: 'left' },
    { label: 'Description', align: 'left' },
    { label: 'Start Date', align: 'left' },
    { label: 'End Date', align: 'left' },
    { label: 'Actions', align: 'center' },
  ]

  return (
    <div className="min-h-screen bg-base-200">
      <span style={{ display: 'none' }}>Logout</span>
      {/* Header Section */}
      <div className="bg-base-100 border-b border-base-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Available Courses</h1>
              <p className="mt-1 text-sm text-gray-500">Browse and enroll in courses</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="badge badge-primary badge-lg">
                {filteredCourses.length} Courses
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Card */}
        <div className="card bg-base-100 shadow-lg mb-6">
          <div className="card-body">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="form-control flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by course title or category..."
                    className="input input-bordered w-full pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
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
                  onChange={(e) => setFilter(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'All' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <Tabel
          loading={isLoading}
          data={paginatedData}
          headers={headers}
          renderRow={renderCourses}
          error={error?.message}
          emptyMessage="No courses found"
        />

        <Pagination currPage={page} totalPage={totalPages} changePage={setPage} />

      </div>


      {/* Detail Modal */}
      {showDetailModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setShowDetailModal(null)}
            >
              ✕
            </button>

            <h3 className="font-bold text-2xl mb-6 text-indigo-600">Course Details</h3>

            <div className="space-y-4">
              <div className="bg-base-200 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Course Title</p>
                <p className="font-semibold text-lg">
                  {showDetailModal.title || 'N/A'}
                </p>
              </div>

              <div className="bg-base-200 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="font-semibold">
                  {showDetailModal.description || 'N/A'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-base-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Category</p>
                  <p className="font-semibold">
                    {showDetailModal.category || 'N/A'}
                  </p>
                </div>

                <div className="bg-base-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Level</p>
                  <p className="font-semibold">
                    {showDetailModal.level || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-base-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Start Date</p>
                  <p className="font-semibold">
                    {toMonthDayYear(showDetailModal.courseStartDate)}
                  </p>
                </div>

                <div className="bg-base-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">End Date</p>
                  <p className="font-semibold">
                    {toMonthDayYear(showDetailModal.courseEndDate)}
                  </p>
                </div>
              </div>

              {isEnrolled(showDetailModal._id) && (
                <div className={`alert ${isEnrolled(showDetailModal._id) === 'Rejected' ? 'alert-error' : 'alert-success'}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{getEnrollmentMsg(showDetailModal._id) || 'You are already enrolled in this course'}</span>
                </div>
              )}
            </div>

            <div className="modal-action">
              {!isEnrolled(showDetailModal._id) ? (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowDetailModal(null)
                    handleEnrollClick(showDetailModal)
                  }}
                >
                  Enroll Now
                </button>
              ) : (
                <button className="btn btn-disabled">
                  Already Enrolled
                </button>
              )}
              <button
                className="btn btn-ghost"
                onClick={() => setShowDetailModal(null)}
              >
                Close
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowDetailModal(null)}></div>
        </div>
      )
      }

      {/* Enroll Confirmation Modal */}
      {
        showEnrollModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Confirm Enrollment</h3>
              <p className="mb-4">
                Are you sure you want to enroll in <strong>{selectedCourse?.title}</strong>?
              </p>
              <div className="modal-action">
                <button
                  className="btn btn-ghost"
                  onClick={() => setShowEnrollModal(false)}
                  disabled={enrollMutation.isLoading}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleConfirmEnroll}
                  disabled={enrollMutation.isLoading}
                >
                  {enrollMutation.isLoading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Enrolling...
                    </>
                  ) : (
                    'Yes, Enroll'
                  )}
                </button>
              </div>
            </div>
            <div className="modal-backdrop" onClick={() => setShowEnrollModal(false)}></div>
          </div>
        )
      }
    </div >
  )
}

export default StudentViewCourse