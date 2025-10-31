import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../userSlice';
import PropTypes from 'prop-types';


function LogoutModal({ isVisible, onClose }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const handleLogout = () => {
        dispatch(logout());
        onClose();
        navigate('/login');
    };

    if (!isVisible) return null;
    
    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Confirm Logout</h3>
                <p className="py-4">Are you sure you want to logout?</p>
                <div className="modal-action">
                    <button
                        className="btn btn-ghost"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-error"
                        onClick={handleLogout}
                    >
                        Yes, Logout
                    </button>
                </div>
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    )
}

LogoutModal.prototypes={
    isVisible: PropTypes.bool,
    onClose: PropTypes.func
};


export default LogoutModal