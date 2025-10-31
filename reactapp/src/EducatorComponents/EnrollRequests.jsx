import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { getAllEnrollments, rejectEnrollmentMsg, updateEnrollmentStatus } from '../apiConfig';
import { toast } from 'react-toastify'
import SearchAndFilter from '../Components/Utilities/SearchAndFilter';
import Tabel from '../Components/Utilities/Table';
import { toMonthDayYear } from '../utilities/date';
import Pagination from '../Components/Utilities/Pagination';

const EnrollRequests = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPage, setTotalPage] = useState(1)
  const [currPage, setCurrPage] = useState(1)
  const [filter, setFilter] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(null);

  const [showRejectModal, setShowRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['enrollments'],
    queryFn: getAllEnrollments,
    select: (response) => response.enrollments || response,
    retry: 1,
    sortBy: { createdAt: -1 }
  });

  const enrollments = data || [];

  const handleStatusChange = async (id, status) => {
    try {
      await updateEnrollmentStatus(id, { status });
      toast.success('Enrollment approved successfully');
      // Invalidate and refetch
      queryClient.invalidateQueries(['enrollments']);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const rejectEnrollment = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please enter a rejection reason.');
      return;
    }
    try {
      await rejectEnrollmentMsg(showRejectModal._id, {
        status: 'Rejected',
        message: rejectReason,
      });
      toast.success('Enrollment rejected successfully');
      setRejectReason('');
      setShowRejectModal(null);
      // Invalidate and refetch
      queryClient.invalidateQueries(['enrollments']);
    } catch (error) {
      toast.error('Failed to reject enrollment.');
    }
  }

  const handleSearch = (searchValue) => {
    setSearch(searchValue);
  };

  const handleFilter = (filterValue) => {
    setFilter(filterValue);
  };

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const courseTitle = enrollment?.courseId?.title || '';
    const studentName = enrollment?.userId?.userName || '';

    const matchesSearch = search.trim() === '' ||
      courseTitle.toLowerCase().includes(search.toLowerCase().trim()) ||
      studentName.toLowerCase().includes(search.toLowerCase().trim())

    const enrollmentStatus = enrollment?.status || '';
    const normalizedStatus = enrollmentStatus.charAt(0).toUpperCase() +
      enrollmentStatus.slice(1).toLowerCase();

    const matchesFilter = !filter || normalizedStatus === filter;

    return matchesSearch && matchesFilter;
  });

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const totalPages = Math.ceil(filteredEnrollments?.length / limit)
  const paginatedData = filteredEnrollments.slice(startIndex, endIndex)


  const getStatusBadgeClass = (status) => {
    const normalizedStatus = status?.toLowerCase() || '';
    switch (normalizedStatus) {
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

  // Define table headers
  const headers = [
    { label: 'Sr.No', align: 'left' },
    { label: 'Course Title', align: 'left' },
    { label: 'Student Name', align: 'left' },
    { label: 'Email', align: 'left' },
    { label: 'Enrollment Date', align: 'left' },
    { label: 'Status', align: 'center', width: '120px' },
    { label: 'Actions', align: 'center', width: '150px' }
  ];

  const filterArr = [{ value: '', text: 'All' }, { value: 'Pending', text: 'Pending' }, { value: 'Approved', text: 'Approved' }, { value: 'Rejected', text: 'Rejected' }]

  // Render row function
  const renderEnrollmentRow = (enrollment, idx) => (
    <tr key={enrollment._id} className="hover">
      <td>
        <div className="font-semibold text-gray-900">{(page - 1) * limit + idx + 1}</div>
      </td>
      <td>
        <div className="font-medium text-gray-900">
          {enrollment.courseId?.title || 'N/A'}
        </div>
      </td>
      <td>
        <div className="font-medium text-gray-700">
          {enrollment.userId?.userName || 'N/A'}
        </div>
      </td>
      <td>
        <div className="text-gray-600">
          {enrollment.userId?.email || 'N/A'}
        </div>
      </td>
      <td>
        <div className="text-gray-600">
          {new Date(enrollment.enrollmentDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </td>
      <td className="text-center">
        <span className={getStatusBadgeClass(enrollment.status)}>
          {enrollment.status}
        </span>
      </td>
      <td>
        <div className="flex items-center justify-center gap-2">
          {enrollment.status?.toLowerCase() === 'pending' ? (
            // Show Approve/Reject for Pending
            <>
              <button
                onClick={() => handleStatusChange(enrollment._id, 'Approved')}
                className="btn btn-sm btn-success btn-dash"
                title="Approve"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
              <button
                onClick={() => setShowRejectModal(enrollment)}
                className="btn btn-sm btn-error btn-dash"
                title="Reject"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </>
          ) : (
            // Show Eye Icon for Approved/Rejected
            <button
              onClick={() => setShowDetailModal(enrollment)}
              className="btn btn-sm btn-ghost btn-circle"
              title="View Details"
            >
              <svg
                className="w-5 h-5"
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
            </button>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header Section */}
      <div className="bg-base-100 border-b border-base-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Enrollment Requests for Approval</h1>
              <p className="mt-1 text-sm text-gray-500">Manage and review student enrollment applications</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="badge badge-primary badge-lg">
                {filteredEnrollments.length} Total
              </div>
              <div className="badge badge-warning badge-lg">
                {filteredEnrollments.filter(e => e?.status?.toLowerCase() === 'pending').length} Pending
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Use SearchAndFilter Component */}
        <SearchAndFilter
          onSearch={handleSearch}
          onFilter={handleFilter}
          searchPlaceholder="Search..."
          filterArr={filterArr}
        />

        {/* Use Table Component */}
        <Tabel
          headers={headers}
          data={paginatedData}
          loading={isLoading}
          error={isError ? error?.message : null}
          emptyMessage="No enrollment requests found"
          renderRow={renderEnrollmentRow}
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

            <h3 className="font-bold text-2xl mb-6 text-indigo-600">Enrollment Details</h3>

            <div className="space-y-4">
              <div className="bg-base-200 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Course</p>
                <p className="font-semibold text-lg">{showDetailModal.courseId?.title || 'N/A'}</p>
              </div>
              <div className="bg-base-200 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Student Name</p>
                <p className="font-semibold">{showDetailModal.userId?.userName || 'N/A'}</p>
              </div>
              <div className="bg-base-200 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-semibold">{showDetailModal.userId?.email || 'N/A'}</p>
              </div>
              <div className="bg-base-200 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Enrollment Date</p>
                <p className="font-semibold">{toMonthDayYear(showDetailModal.enrollmentDate) || 'N/A'}</p>
              </div>

              {showDetailModal.status?.toLowerCase() === 'rejected' && (
                <div className="bg-error/10 border border-error/30 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-error mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-error mb-1">Rejection Reason</p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {showDetailModal.message || 'No reason provided'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

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

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => {
                setRejectReason('');
                setShowRejectModal(null);
              }}
            >
              ✕
            </button>

            <h3 className="font-bold text-xl mb-4 text-error flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Reject Enrollment
            </h3>

            <div className="bg-base-200 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Student:</span> {showRejectModal.userId?.userName}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Course:</span> {showRejectModal.courseId?.title}
              </p>
            </div>

            <p className="text-gray-600 mb-2 font-medium">
              Please provide a reason for rejecting this enrollment request:
            </p>

            <textarea
              className="textarea textarea-bordered w-full h-32"
              placeholder="Enter rejection reason (e.g., Prerequisites not met, Course is full, etc.)"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              autoFocus
            ></textarea>

            <div className="modal-action">
              <button
                className="btn btn-error"
                onClick={rejectEnrollment}
                disabled={!rejectReason.trim()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Confirm Rejection
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setRejectReason('');
                  setShowRejectModal(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => {
            setRejectReason('');
            setShowRejectModal(null);
          }}></div>
        </div>
      )}
      <span style={{ display: 'none' }}>Logout</span>
    </div>
  );
};

export default EnrollRequests;