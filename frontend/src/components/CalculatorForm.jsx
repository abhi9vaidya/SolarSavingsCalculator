// ====================================
// Calculator Form Component
// ====================================
// This is the main input form where users enter:
// - Roof area
// - Panel type (efficiency)
// - Electricity rate
// And then click Calculate to see results

import React from 'react';
import { PANEL_TYPES } from '../utils/constants';
import LocationSearch from './LocationSearch';

function CalculatorForm({
    formData,
    onFormChange,
    onLocationFound,
    onCalculate,
    isCalculating,
    onError
}) {

    /**
     * Handle form submission
     */
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page reload
        onCalculate(); // Tell parent component to calculate
    };

    /**
     * Handle input changes
     * Updates the form data in the parent component
     */
    const handleChange = (field, value) => {
        onFormChange({
            ...formData,
            [field]: value
        });
    };

    return (
        <div className="card input-section">
            <h2 className="card-title">Location & Parameters</h2>

            <form onSubmit={handleSubmit} className="solar-form">

                {/* Location Search */}
                <LocationSearch
                    onLocationFound={onLocationFound}
                    onError={onError}
                />

                {/* Latitude and Longitude inputs */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="latitude">Latitude</label>
                        <input
                            type="number"
                            id="latitude"
                            step="any"
                            placeholder="e.g., 28.6139"
                            value={formData.latitude}
                            onChange={(e) => handleChange('latitude', e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="longitude">Longitude</label>
                        <input
                            type="number"
                            id="longitude"
                            step="any"
                            placeholder="e.g., 77.2090"
                            value={formData.longitude}
                            onChange={(e) => handleChange('longitude', e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Roof Area Input */}
                <div className="form-group">
                    <label htmlFor="roofArea">
                        Roof Area (m²)
                        <span className="tooltip" title="Enter the usable roof area in square meters">ℹ️</span>
                    </label>
                    <input
                        type="number"
                        id="roofArea"
                        min="1"
                        max="10000"
                        placeholder="e.g., 50"
                        value={formData.roofArea}
                        onChange={(e) => handleChange('roofArea', e.target.value)}
                        required
                    />
                    {/* Note explaining why we ask for manual input */}
                    <small className="hint">
                        Note: Satellite imagery is for visualization only.
                        Please measure and enter your actual roof area.
                    </small>
                </div>

                {/* Panel Type Selection */}
                <div className="form-group">
                    <label htmlFor="panelEfficiency">
                        Panel Type
                        <span className="tooltip" title="Select your solar panel type">ℹ️</span>
                    </label>
                    <select
                        id="panelEfficiency"
                        value={formData.panelEfficiency}
                        onChange={(e) => handleChange('panelEfficiency', e.target.value)}
                        required
                    >
                        {/* Loop through panel types and create options */}
                        {PANEL_TYPES.map((panel) => (
                            <option key={panel.value} value={panel.value}>
                                {panel.label}
                            </option>
                        ))}
                    </select>
                    <div className="range-hint">
                        Higher efficiency = More power from same roof area
                    </div>
                </div>

                {/* Electricity Rate Input */}
                <div className="form-group">
                    <label htmlFor="electricityRate">
                        Electricity Rate (₹/kWh)
                        <span className="tooltip" title="Your current electricity cost per unit">ℹ️</span>
                    </label>
                    <input
                        type="number"
                        id="electricityRate"
                        min="1"
                        max="20"
                        step="0.5"
                        value={formData.electricityRate}
                        onChange={(e) => handleChange('electricityRate', e.target.value)}
                        required
                    />
                </div>

                {/* Calculate Button */}
                <button
                    type="submit"
                    className="btn-primary"
                    id="calculateBtn"
                    disabled={isCalculating}
                >
                    {isCalculating ? (
                        // Show loading state
                        <span className="btn-loader">
                            <span className="spinner"></span>
                            Calculating...
                        </span>
                    ) : (
                        // Show normal state
                        <span className="btn-text">Calculate Solar Potential</span>
                    )}
                </button>
            </form>
        </div>
    );
}

export default CalculatorForm;
