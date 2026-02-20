import React from "react";

function DeleteConfirmModal({ isOpen, onClose, onConfirm, leadName, isBulk = false, count = 0 }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Confirm Delete</h3>
        </div>
        <div className="modal-body">
          {isBulk ? (
            <p>
              Are you sure you want to delete <strong>{count}</strong> selected lead(s)? 
              This action cannot be undone.
            </p>
          ) : (
            <p>
              Are you sure you want to delete the lead <strong>"{leadName}"</strong>? 
              This action cannot be undone.
            </p>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
