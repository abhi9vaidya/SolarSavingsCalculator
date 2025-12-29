import React, { useRef, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { MONTHS } from '../utils/constants';

// register chartjs parts
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const MonthlyChart = ({ monthlyData, roofArea, efficiency }) => {

    const chartRef = useRef(null);

    // Forces a chart update on mount to avoid sizing issues
    useEffect(() => {
        const timer = setTimeout(() => {
            if (chartRef.current) {
                chartRef.current.update();
            }
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // prepare data for chart
    const calculateMonthlyEnergy = () => {
        const area = parseFloat(roofArea) || 0;
        const eff = parseFloat(efficiency) || 0;

        return monthlyData.map(item => {
            const irrValue = parseFloat(item.irradiance) || 0;
            // More precise calculation: area * efficiency * monthly irradiance * (365/12 days)
            return Math.round(area * (eff / 100) * irrValue * 30.42);
        });
    };

    const chartData = {
        labels: MONTHS,
        datasets: [
            {
                label: 'Monthly Generation (kWh)',
                data: calculateMonthlyEnergy(),
                backgroundColor: 'rgba(16, 185, 129, 0.4)', // Semi-transparent Forest Green
                borderColor: '#10B981',
                borderWidth: 2,
                borderRadius: 4,
                hoverBackgroundColor: '#059669',
                barPercentage: 0.7,
                categoryPercentage: 0.8,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1000, easing: 'easeOutQuart' },
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    color: '#94A3B8',
                    usePointStyle: true,
                    pointStyle: 'rectRounded',
                    font: { family: 'Inter', size: 11, weight: '500' }
                }
            },
            title: { display: false },
            tooltip: {
                backgroundColor: '#1E293B',
                padding: 12,
                cornerRadius: 8,
                titleFont: { family: 'Inter', size: 14, weight: 'bold' },
                bodyFont: { family: 'Inter', size: 13 },
                borderColor: 'rgba(255,255,255,0.05)',
                borderWidth: 1,
                displayColors: false,
                callbacks: {
                    label: (context) => `⚡ ${context.raw.toLocaleString('en-IN')} kWh`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255,255,255,0.03)', drawTicks: false },
                ticks: { color: '#64748B', font: { size: 10 }, padding: 10 },
                border: { display: false }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#64748B', font: { size: 11 }, padding: 5 },
                border: { display: false }
            }
        }
    };

    return (
        <div className="chart-container card">
            <div className="card-header">
                <h2>Monthly Energy Profile</h2>
                <p className="subtitle">Estimated generation based on historical irradiance</p>
            </div>
            <div className="chart-wrapper">
                <Bar ref={chartRef} options={options} data={chartData} />
            </div>
        </div>
    );
};

export default MonthlyChart;
