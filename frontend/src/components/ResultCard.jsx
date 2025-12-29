import React, { useEffect, useState } from 'react';

// card for single stat with animation
const ResultCard = ({ title, value, unit, icon, description, color }) => {
    const [displayValue, setDisplayValue] = useState(0);

    // animate number count up
    useEffect(() => {
        let start = 0;
        const end = parseInt(value); // target number
        if (start === end) return;

        // rapid update loop
        let timer = setInterval(() => {
            start += Math.ceil(end / 50); // step size
            if (start >= end) {
                clearInterval(timer);
                start = end;
            }
            setDisplayValue(start);
        }, 20); // speed

        return () => clearInterval(timer);
    }, [value]);

    return (
        <div className={`result-card border-${color}`}>
            <div className="card-icon">{icon}</div>
            <div className="card-content">
                <h4 className="card-title">{title}</h4>
                <div className="card-value">
                    {/* format number with commas like 1,000 */}
                    {displayValue.toLocaleString()}
                    <span className="unit">{unit}</span>
                </div>
                <p className="card-desc">{description}</p>
            </div>
        </div>
    );
};

export default ResultCard;
