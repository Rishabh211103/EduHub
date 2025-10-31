import React, { useState, useRef } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LogoutModal from '../Components/Utilities/LogoutModal';

const EducatorNavbar = () => {
  const user = useSelector((state) => {
    console.log(state)
    console.log(state.users)
    return state.users.user
  });
  const userName = user?.userName || "Educator";
  console.log(user);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const detailsRef = useRef(null);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleCloseModal = () => {
    setShowLogoutModal(false);
  };

  const handleDropdownClick = () => {
    // Close the dropdown after navigation
    if (detailsRef.current) {
      detailsRef.current.removeAttribute('open');
    }
  };

  return (
    <>
      <nav className="navbar bg-base-100 border-b border-base-300 px-6">
        <div className="navbar-start">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-indigo-600">EduHub</span>
          </div>
        </div>

        <div className="navbar-center">
          <ul className="menu menu-horizontal px-1 gap-1">
            <li>
              <Link 
                to="/educator" 
                className="font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
              >
                Home
              </Link>
            </li>
            <li>
              <details ref={detailsRef}>
                <summary className="font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50">
                  Course
                </summary>
                <ul className="bg-base-100 rounded-t-none p-2 z-10 shadow-lg border border-base-300">
                  <li>
                    <Link 
                      to="/educator/courses/add" 
                      className="font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                      onClick={handleDropdownClick}
                    >
                      Add Course
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/educator/courses" 
                      className="font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                      onClick={handleDropdownClick}
                    >
                      View Course
                    </Link>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <Link 
                to="/educator/enrollments" 
                className="font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
              >
                Enrollment Requests
              </Link>
            </li>
          </ul>
        </div>

        <div className="navbar-end gap-4">
          <div className="badge badge-soft badge-primary">{userName}/Educator</div>

          <button
            onClick={handleLogoutClick}
            className="btn btn-ghost btn-sm gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <LogoutModal 
        isVisible={showLogoutModal} 
        onClose={handleCloseModal} 
      />

      <Outlet />
    </>
  );
};

export default EducatorNavbar;