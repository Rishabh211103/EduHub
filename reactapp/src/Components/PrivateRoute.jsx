import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute({ allowedRole }) {
    const { role, isAuthenticated } = useSelector(state => state.users);
    console.log('PrivateRoute - State:', { role, isAuthenticated, allowedRole });

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRole) {
        if (role === 'educator') {
            <Navigate to='/educator'  replace />
            return <Outlet />
        }
        if (role === 'student') {
            return <Navigate to='/student' replace />
        }
    }


    if (allowedRole && role !== allowedRole) {

        if (role === 'educator') {
            return <Navigate to="/educator" replace />;
        } else if (role === 'student') {
            return <Navigate to="/student" replace />;
        } else {
            return <Navigate to="/login" replace />;
        }
    }

    return <Outlet />;
}

export default PrivateRoute;