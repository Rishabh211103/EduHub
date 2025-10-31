import React from 'react';
import PropTypes from 'prop-types';

function ConfirmModal({ message, onConfirm, onCancel, confirmText = "Yes, Confirm", cancelText = "Cancel", isLoading = false }) {
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirm Action</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <button 
            onClick={onCancel} 
            className="btn btn-ghost"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm} 
            className="btn btn-error"
            disabled={isLoading}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmModal.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  isLoading: PropTypes.bool
};


export default ConfirmModal;