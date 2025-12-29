import React from 'react';
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

    // prepare data for chart
    const calculateMonthlyEnergy = () => {
        return monthlyData.map(irradiance => {
            // monthly calc: area * eff * sun * 30 days
            return Math.round(roofArea * (efficiency / 100) * irradiance * 30);
        });
    };

    const chartData = {
        labels: MONTHS,
        datasets: [
            {
                label: 'Energy Generation (kWh)',
                data: calculateMonthlyEnergy(),
                backgroundColor: 'rgba(76, 175, 80, 0.7)', // green bars
                borderColor: 'rgba(76, 175, 80, 1)',
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.raw} kWh`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Monthly Energy (kWh)' }
            }
        }
    };

    return (
        <div className="chart-container card">
            <div className="card-header">
                <h3>Monthly Energy Generation</h3>
            </div>
            <div className="chart-wrapper">
                <Bar options={options} data={chartData} />
            </div>
        </div>
    );
};

export default MonthlyChart;
