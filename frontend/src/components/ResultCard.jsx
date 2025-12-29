import React, { useEffect, useState } from 'react';

// card for single stat with animation
const ResultCard = ({ title, value, unit, icon, description, color }) => {
    const [displayValue, setDisplayValue] = useState(0);

    // animate number count up
    useEffect(() => {
        let start = 0;
        const end = parseFloat(value); // use fractional part too
        if (isNaN(end)) return;
        if (start === end) {
            setDisplayValue(end);
            return;
        }

        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const currentVal = start + progress * (end - start);
            setDisplayValue(currentVal);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setDisplayValue(end);
            }
        };

        requestAnimationFrame(animate);
    }, [value]);

    return (
        <div className={`result-card border-${color}`}>
            <div className="card-icon">{icon}</div>
            <div className="card-content">
                <h4 className="card-title">{title}</h4>
                <div className="card-value">
                    {displayValue.toLocaleString('en-IN', {
                        minimumFractionDigits: value % 1 === 0 ? 0 : 1,
                        maximumFractionDigits: 1
                    })}
                    <span className="unit">{unit}</span>
                </div>
                <p className="card-desc">{description}</p>
            </div>
        </div>
    );
};

export default ResultCard;
