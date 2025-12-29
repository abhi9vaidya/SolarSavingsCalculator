// ====================================
// Result Card Component
// ====================================
// This is a reusable card that displays one result metric
// We use it 4 times: Energy, Savings, CO2, and Irradiance

import React, { useEffect, useState } from 'react';

function ResultCard({ icon, title, value, unit, description, currency, colorClass }) {
    // State for animated value (starts at 0 and counts up)
    const [displayValue, setDisplayValue] = useState(0);

    // Animate the number when the value changes
    useEffect(() => {
        // Start from 0
        let currentValue = 0;
        const targetValue = value;
        const duration = 1000; // 1 second animation
        const steps = 60; // 60 frames for smooth animation
        const increment = targetValue / steps;
        const stepDuration = duration / steps;

        // Create an interval that updates the number gradually
        const timer = setInterval(() => {
            currentValue += increment;

            // If we've reached or passed the target, stop and set final value
            if (currentValue >= targetValue) {
                setDisplayValue(Math.round(targetValue));
                clearInterval(timer);
            } else {
                setDisplayValue(Math.round(currentValue));
            }
        }, stepDuration);

        // Clean up the interval when component unmounts
        return () => clearInterval(timer);
    }, [value]); // Re-run animation when value changes

    return (
        <div className={`result-card ${colorClass}`}>
            {/* Icon (emoji) for visual appeal */}
            <div className="result-icon">{icon}</div>

            <div className="result-content">
                {/* Title (e.g., "Annual Energy Generation") */}
                <h3>{title}</h3>

                {/* The main number with optional currency symbol and unit */}
                <div className="result-value">
                    {currency && <span className="currency">{currency}</span>}
                    <span>{displayValue.toLocaleString('en-IN')}</span>
                    {unit && <span className="unit">{unit}</span>}
                </div>

                {/* Description explaining what this number means */}
                <p className="result-desc">{description}</p>
            </div>
        </div>
    );
}

export default ResultCard;
