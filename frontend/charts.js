/**
 * Charts Module for Solar Potential Calculator
 * 
 * This module handles all Chart.js visualizations for the application.
 * Uses Chart.js library for creating responsive, interactive charts.
 * 
 * Main Visualization:
 * - Monthly energy generation bar chart
 * - Shows estimated solar energy for each month
 */

// Chart instance reference (for updates)
let monthlyChart = null;

// Chart color configuration matching app design
const chartColors = {
    primary: 'rgba(46, 125, 50, 0.8)',      // Green
    primaryLight: 'rgba(76, 175, 80, 0.6)',
    secondary: 'rgba(255, 193, 7, 0.8)',     // Solar Yellow
    gradient: null // Will be set during initialization
};

// Month labels for x-axis
const monthLabels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Initialize the monthly energy generation chart
 * Creates an empty chart that will be updated with data later
 */
function initializeChart() {
    const ctx = document.getElementById('monthlyChart');

    if (!ctx) {
        console.error('Chart canvas element not found');
        return;
    }

    // Destroy existing chart if any
    if (monthlyChart) {
        monthlyChart.destroy();
    }

    // Create gradient for bars
    const context = ctx.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(76, 175, 80, 0.9)');
    gradient.addColorStop(1, 'rgba(46, 125, 50, 0.6)');
    chartColors.gradient = gradient;

    // Chart configuration
    monthlyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: monthLabels,
            datasets: [{
                label: 'Energy Generation (kWh)',
                data: Array(12).fill(0), // Start with empty data
                backgroundColor: gradient,
                borderColor: 'rgba(46, 125, 50, 1)',
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
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
                        label: function (context) {
                            return `${context.parsed.y.toFixed(1)} kWh`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: "'Inter', sans-serif",
                            size: 11
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
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
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });

    console.log('Chart initialized successfully');
}

/**
 * Update the chart with monthly energy data
 * 
 * @param {Array} monthlyData - Array of monthly irradiance values from API
 * @param {number} roofArea - Roof area in square meters
 * @param {number} efficiency - Panel efficiency as percentage
 */
function updateChart(monthlyData, roofArea, efficiency) {
    if (!monthlyChart) {
        console.error('Chart not initialized');
        initializeChart();
    }

    // Calculate monthly energy generation for each month
    // Formula: Roof Area × Efficiency × Irradiance × Days in Month
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    const monthlyEnergy = monthlyData.map((data, index) => {
        const irradiance = data.irradiance || 0;
        const days = daysInMonth[index] || 30;

        // Calculate monthly energy
        const energy = roofArea * (efficiency / 100) * irradiance * days;
        return parseFloat(energy.toFixed(1));
    });

    // Update chart data
    monthlyChart.data.datasets[0].data = monthlyEnergy;

    // Animate the update
    monthlyChart.update('default');

    console.log('Chart updated with monthly data:', monthlyEnergy);
}

/**
 * Update chart with simple annual data (when monthly API data is not available)
 * Distributes annual energy across months with seasonal variation
 * 
 * @param {number} annualEnergy - Total annual energy in kWh
 */
function updateChartWithAnnualData(annualEnergy) {
    if (!monthlyChart) {
        initializeChart();
    }

    // Seasonal variation factors (relative to average)
    // Higher in summer months, lower in winter (for Northern Hemisphere)
    const seasonalFactors = [
        0.70,  // Jan - Winter
        0.80,  // Feb
        0.95,  // Mar - Spring
        1.05,  // Apr
        1.15,  // May
        1.20,  // Jun - Summer peak
        1.20,  // Jul
        1.15,  // Aug
        1.00,  // Sep - Fall
        0.90,  // Oct
        0.75,  // Nov
        0.65   // Dec - Winter
    ];

    // Calculate monthly distribution
    const totalFactor = seasonalFactors.reduce((a, b) => a + b, 0);
    const monthlyEnergy = seasonalFactors.map(factor => {
        return parseFloat(((annualEnergy * factor) / totalFactor).toFixed(1));
    });

    // Update chart
    monthlyChart.data.datasets[0].data = monthlyEnergy;
    monthlyChart.update('default');

    console.log('Chart updated with seasonal distribution:', monthlyEnergy);
}

/**
 * Reset chart to empty state
 */
function resetChart() {
    if (monthlyChart) {
        monthlyChart.data.datasets[0].data = Array(12).fill(0);
        monthlyChart.update('default');
    }
}

// Export functions for use in app.js
window.SolarCharts = {
    initializeChart,
    updateChart,
    updateChartWithAnnualData,
    resetChart
};
