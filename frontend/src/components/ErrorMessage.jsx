// ====================================
// Error Message Component
// ====================================
// This shows error messages to the user when something goes wrong
// For example: invalid location, network error, etc.

import React from 'react';

function ErrorMessage({ message, onClose }) {
    // If there's no error message, don't show anything
    if (!message) return null;

    return (
        <div className="error-message">
            {/* Warning icon to catch attention */}
            <span className="error-icon">⚠️</span>

            {/* The actual error message */}
            <span id="errorText">{message}</span>

            {/* Optional close button (if onClose function is provided) */}
            {onClose && (
                <button
                    onClick={onClose}
                    className="error-close"
                    aria-label="Close error message"
                >
                    ×
                </button>
            )}
        </div>
    );
}

export default ErrorMessage;
