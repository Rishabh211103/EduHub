import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { ChatApi, getUserEnrolledCourses } from '../apiConfig';
import { useNavigate } from 'react-router-dom';
import { BotMessageSquare } from 'lucide-react'
import Tabel from '../Components/Utilities/Table';
import { toMonthDayYear } from '../utilities/date';
import SearchAndFilter from '../Components/Utilities/SearchAndFilter';

function EnrolledCourses() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showDetailModal, setShowDetailModal] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['enrolledCourses', user?.id],
    queryFn: () => getUserEnrolledCourses(user.id),
    enabled: !!user?.id,
    refetchOnWindowFocus: true,
  });

  const enrolledCourses = data?.enrollments || data || [];

  const filteredCourses = enrolledCourses.filter((enrollment) => {
    const courseTitle = enrollment.courseId?.title || enrollment.course?.title || '';
    const courseDescription = enrollment.courseId?.description || enrollment.course?.description || '';
    const matchesSearch = courseTitle.toLowerCase().includes(search.toLowerCase()) || courseDescription.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || enrollment.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'badge badge-success';
      case 'rejected':
        return 'badge badge-error';
      case 'pending':
        return 'badge badge-warning';
      default:
        return 'badge badge-ghost';
    }
  };

  const getCourseData = (enrollment) => {
    return enrollment.courseId || enrollment.course || {};
  };

  const handleViewMaterial = (courseId) => {
    navigate(`/student/materials/${courseId}`, { state: { courseId } });
  };

  const handleOpenAi = async (title, courseId) => {
    try {
      const { session } = await ChatApi.createChatSession({
        userId: user.id,
        title: `New Chat ${title}`
      })
      navigate(`/student/chat/${session._id}/${courseId}`)
    } catch (error) {
      console.log(error)
    }
  }
  const renderEnrolledCourses = (enrollment, idx) => {
    const course = getCourseData(enrollment);
    if (!course.title) return null;

    return (
      <tr key={enrollment._id} className="hover">
        <td>{idx + 1}</td>
        <td className="font-medium text-gray-900">
          {course.title || 'N/A'}
        </td>
        <td className="text-gray-600 max-w-xs truncate">
          {course.description || 'N/A'}
        </td>
        <td className="text-gray-600">
          {toMonthDayYear(course.courseStartDate)}
        </td>
        <td className="text-gray-600">
          {toMonthDayYear(course.courseEndDate)}
        </td>
        <td className="text-center">
          <span className={getStatusBadgeClass(enrollment.status)}>
            {enrollment.status}
          </span>
        </td>

        <td>
          <div className="flex items-center justify-center">
            {enrollment.status?.toLowerCase() === 'rejected' ? (
              <span className="text-sm text-gray-400 italic">
                <div
                  className="tooltip tooltip-left before:max-w-xs before:whitespace-normal before:bg-white before:text-gray-800 before:shadow-xl before:border before:border-gray-200 before:p-4 before:rounded-lg after:border-r-white"
                  data-tip={
                    enrollment.message
                      ? enrollment.message
                      : 'No reason provided'
                  }
                >
                  <div className="relative group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-error cursor-help transition-all duration-200 group-hover:scale-110 group-hover:text-error-focus"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="absolute inset-0 rounded-full bg-error opacity-20 animate-ping group-hover:opacity-0"></span>
                  </div>
                </div>
              </span>
            ) : (
              <div className="dropdown dropdown-end">
                <button
                  tabIndex={0}
                  className="btn btn-sm btn-ghost btn-circle"
                  title="Actions"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </button>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                >
                  <li className='hidden'>
                    <button className="flex items-center gap-2" onClick={() => handleOpenAi(course.title, course._id)}>
                      <BotMessageSquare size={24} strokeWidth={1} />
                      Start Exploring
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setShowDetailModal(enrollment)}
                      className="flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View Course Details
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleViewMaterial(course._id)}
                      className="flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      View Materials
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </td>
      </tr>
    );
  };

  const headers = [
    { label: 'Sr No', align: 'left' },
    { label: 'Course Title', align: 'left' },
    { label: 'Description', align: 'left' },
    { label: 'Start Date', align: 'left' },
    { label: 'End Date', align: 'left' },
    { label: 'Status', align: 'center' },
    { label: 'Actions', align: 'center' },
  ];

  const filterArr = [{ value: 'Pending', text: 'Pending' }, { value: 'Approved', text: 'Approved' }, { value: 'Rejected', text: 'Rejected' }]
  return (
    <div className="min-h-screen bg-base-200">
      <span style={{ display: 'none' }}>Logout</span>

      {/* Header Section */}
      <div className="bg-base-100 border-b border-base-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Enrolled Courses</h1>
              <p className="mt-1 text-sm text-gray-500">View and manage your course enrollments</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="badge badge-primary badge-lg">
                {filteredCourses.length} Total
              </div>
              <div className="badge badge-success badge-lg">
                {filteredCourses.filter(e => e.status === 'Approved').length} Approved
              </div>
              <div className="badge badge-warning badge-lg">
                {filteredCourses.filter(e => e.status === 'Pending').length} Pending
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Card */}
        <SearchAndFilter
          onSearch={setSearch}
          onFilter={setFilter}
          filterArr={filterArr}
          searchPlaceholder={'Search...'} />

        {/* Table Card */}
        <Tabel
          loading={isLoading}
          data={filteredCourses}
          headers={headers}
          renderRow={renderEnrolledCourses}
          error={error?.message}
          emptyMessage={
            enrolledCourses.length === 0
              ? "You haven't enrolled in any courses yet"
              : "No courses found"
          }
        />
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
                  {getCourseData(showDetailModal).title || 'N/A'}
                </p>
              </div>

              <div className="bg-base-200 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="font-semibold">
                  {getCourseData(showDetailModal).description || 'N/A'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-base-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Category</p>
                  <p className="font-semibold">
                    {getCourseData(showDetailModal).category || 'N/A'}
                  </p>
                </div>

                <div className="bg-base-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Level</p>
                  <p className="font-semibold">
                    {getCourseData(showDetailModal).level || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-base-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Start Date</p>
                  <p className="font-semibold">
                    {toMonthDayYear(getCourseData(showDetailModal).courseStartDate)}
                  </p>
                </div>

                <div className="bg-base-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">End Date</p>
                  <p className="font-semibold">
                    {toMonthDayYear(getCourseData(showDetailModal).courseEndDate)}
                  </p>
                </div>
              </div>

              <div className="bg-base-200 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span className={getStatusBadgeClass(showDetailModal.status)}>
                  {showDetailModal.status}
                </span>
              </div>

              <div className="bg-base-200 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Enrollment Date</p>
                <p className="font-semibold">
                  {showDetailModal.enrollmentDate && new Date(showDetailModal.enrollmentDate).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            <div className="modal-action">
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
      )}
    </div>
  );
}


export default EnrolledCourses;