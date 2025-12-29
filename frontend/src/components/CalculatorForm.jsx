import React from 'react';
import LocationSearch from './LocationSearch';

const CalculatorForm = ({
    formData,
    onFormChange,
    onLocationFound,
    onCalculate,
    isCalculating
}) => {

    const handleChange = (e) => {
        const { name, value } = e.target;
        onFormChange({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // stop reload
        onCalculate();
    };

    return (
        <div className="calculator-form card">
            <div className="card-header">
                <h2>System Parameters</h2>
                <p className="subtitle">Enter your details below</p>
            </div>

            <div className="form-content">
                {/* search box component */}
                <div className="form-group">
                    <label>Search Location</label>
                    <LocationSearch onLocationFound={onLocationFound} />
                </div>

                <form onSubmit={handleSubmit}>
                    {/* coords inputs (auto-filled) */}
                    <div className="form-row">
                        <div className="form-group half">
                            <label htmlFor="latitude">Latitude</label>
                            <input
                                type="number"
                                id="latitude"
                                name="latitude"
                                value={formData.latitude}
                                onChange={handleChange}
                                placeholder="0.000000"
                                step="any"
                                required
                            />
                        </div>
                        <div className="form-group half">
                            <label htmlFor="longitude">Longitude</label>
                            <input
                                type="number"
                                id="longitude"
                                name="longitude"
                                value={formData.longitude}
                                onChange={handleChange}
                                placeholder="0.000000"
                                step="any"
                                required
                            />
                        </div>
                    </div>

                    {/* roof area input */}
                    <div className="form-group">
                        <label htmlFor="roofArea">Roof Area (sq. meters)</label>
                        <input
                            type="number"
                            id="roofArea"
                            name="roofArea"
                            value={formData.roofArea}
                            onChange={handleChange}
                            placeholder="e.g. 50"
                            min="1"
                            required
                        />
                        <small className="hint">Approx area available for panels</small>
                    </div>

                    {/* panel type selection */}
                    <div className="form-group">
                        <label htmlFor="panelEfficiency">Panel Type</label>
                        <select
                            id="panelEfficiency"
                            name="panelEfficiency"
                            value={formData.panelEfficiency}
                            onChange={handleChange}
                        >
                            <option value="15">Polycrystalline (Standard) - 15% eff</option>
                            <option value="18">Monocrystalline (Efficient) - 18% eff</option>
                            <option value="20">PERC / Premium - 20% eff</option>
                            <option value="22">High Efficiency - 22% eff</option>
                        </select>
                    </div>

                    {/* cost input */}
                    <div className="form-group">
                        <label htmlFor="electricityRate">Electricity Rate (₹/kWh)</label>
                        <input
                            type="number"
                            id="electricityRate"
                            name="electricityRate"
                            value={formData.electricityRate}
                            onChange={handleChange}
                            placeholder="e.g. 8"
                            min="0"
                            step="0.1"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`btn-primary ${isCalculating ? 'loading' : ''}`}
                        disabled={isCalculating}
                    >
                        {isCalculating ? 'Calculating...' : 'Calculate Solar Potential'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CalculatorForm;
