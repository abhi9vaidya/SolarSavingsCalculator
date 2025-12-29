// ====================================
// Monthly Chart Component
// ====================================
// This displays a bar chart showing estimated energy generation for each month
// Uses Chart.js library for beautiful, interactive charts

import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { MONTH_LABELS, DAYS_IN_MONTH, SEASONAL_FACTORS } from '../utils/constants';

// Register Chart.js components (required for Chart.js v3+)
Chart.register(...registerables);

function MonthlyChart({ monthlyData, roofArea, efficiency, annualEnergy }) {
    // Reference to the canvas element where we'll draw the chart
    const chartRef = useRef(null);
    // Reference to the Chart.js instance
    const chartInstance = useRef(null);

    useEffect(() => {
        // Get the canvas context for drawing
        const ctx = chartRef.current.getContext('2d');

        // If there's already a chart, destroy it before creating a new one
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Calculate monthly energy values
        let monthlyEnergy;

        if (monthlyData && monthlyData.length === 12) {
            // If we have detailed monthly data from NASA, use it
            monthlyEnergy = monthlyData.map((data, index) => {
                const irradiance = data.irradiance || 0;
                const days = DAYS_IN_MONTH[index];
                const energy = roofArea * (efficiency / 100) * irradiance * days;
                return parseFloat(energy.toFixed(1));
            });
        } else {
            // If we only have annual data, distribute it across months
            // using seasonal factors (more in summer, less in winter)
            const totalFactor = SEASONAL_FACTORS.reduce((a, b) => a + b, 0);
            monthlyEnergy = SEASONAL_FACTORS.map(factor => {
                return parseFloat(((annualEnergy * factor) / totalFactor).toFixed(1));
            });
        }

        // Create a beautiful gradient for the bars
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(76, 175, 80, 0.9)'); // Light green at top
        gradient.addColorStop(1, 'rgba(46, 125, 50, 0.6)'); // Darker green at bottom

        // Create the chart
        chartInstance.current = new Chart(ctx, {
            type: 'bar', // Bar chart
            data: {
                labels: MONTH_LABELS, // Jan, Feb, Mar, etc.
                datasets: [{
                    label: 'Energy Generation (kWh)',
                    data: monthlyEnergy,
                    backgroundColor: gradient,
                    borderColor: 'rgba(46, 125, 50, 1)',
                    borderWidth: 1,
                    borderRadius: 6, // Rounded corners on bars
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true, // Adjust to container size
                maintainAspectRatio: false, // Allow custom height
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: {
                                family: "'Inter', sans-serif",
                                size: 12
                            },
                            usePointStyle: true,
                            pointStyle: 'rectRounded'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(26, 26, 46, 0.9)',
                        titleFont: {
                            family: "'Inter', sans-serif",
                            size: 13
                        },
                        bodyFont: {
                            family: "'Inter', sans-serif",
                            size: 12
                        },
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            // Format the tooltip to show kWh
                            label: function (context) {
                                return `${context.parsed.y.toFixed(1)} kWh`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false // Hide vertical grid lines
                        },
                        ticks: {
                            font: {
                                family: "'Inter', sans-serif",
                                size: 11
                            }
                        }
                    },
                    y: {
                        beginAtZero: true, // Start y-axis at 0
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)' // Light horizontal grid lines
                        },
                        ticks: {
                            font: {
                                family: "'Inter', sans-serif",
                                size: 11
                            },
                            callback: function (value) {
                                return value.toLocaleString() + ' kWh';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Monthly Energy (kWh)',
                            font: {
                                family: "'Inter', sans-serif",
                                size: 12,
                                weight: '500'
                            }
                        }
                    }
                },
                animation: {
                    duration: 1000, // 1 second animation
                    easing: 'easeOutQuart' // Smooth easing
                }
            }
        });

        // Clean up: destroy chart when component unmounts
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [monthlyData, roofArea, efficiency, annualEnergy]); // Re-create chart when data changes

    return (
        <div className="card chart-section">
            <h3 className="card-title">Monthly Energy Generation</h3>
            <div className="chart-container">
                {/* Canvas element where Chart.js will draw */}
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
}

export default MonthlyChart;
