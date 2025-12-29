import React from 'react';

// simple error alert
const ErrorMessage = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="error-message fade-in">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{message}</span>
            <button onClick={onClose} className="close-btn">×</button>
        </div>
    );
};

export default ErrorMessage;
