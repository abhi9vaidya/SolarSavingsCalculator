import React from 'react';
import ResultCard from './ResultCard';
import MonthlyChart from './MonthlyChart';

// container for all results + charts
const ResultsSection = ({ results, solarData, formData, isVisible }) => {
    if (!isVisible || !results) return null;

    return (
        <div className="results-section fade-in">
            <h2 className="section-title">Solar Potential Results</h2>

            {/* 4 cards grid */}
            <div className="results-grid">
                <ResultCard
                    title="Annual Energy Generation"
                    value={results.annualEnergy}
                    unit="kWh/year"
                    icon="⚡"
                    description="Est. electricity generated"
                    color="energy"
                />

                <ResultCard
                    title="Annual Cost Savings"
                    value={results.annualSavings}
                    unit="₹/year"
                    icon="💰"
                    description="Est. money saved on bills"
                    color="savings"
                />

                <ResultCard
                    title="CO₂ Emission Reduction"
                    value={results.co2Saved}
                    unit="kg/year"
                    icon="🌱"
                    description="Carbon footprint reduced"
                    color="co2"
                />

                <ResultCard
                    title="Average Solar Irradiance"
                    value={results.avgDailyIrradiance}
                    unit="kWh/m²/day"
                    icon="☀️"
                    description="Sunlight received at loc"
                    color="solar"
                />
            </div>

            {/* monthly chart visualization */}
            {solarData?.data?.monthlyData && (
                <MonthlyChart
                    monthlyData={solarData.data.monthlyData}
                    roofArea={formData.roofArea}
                    efficiency={formData.panelEfficiency}
                />
            )}
        </div>
    );
};

export default ResultsSection;
