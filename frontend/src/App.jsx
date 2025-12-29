// ====================================
// Main App Component
// ====================================
// This is the brain of our application!
// It manages all the data and coordinates between all the components

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CalculatorForm from './components/CalculatorForm';
import MapView from './components/MapView';
import ResultsSection from './components/ResultsSection';
import ErrorMessage from './components/ErrorMessage';
import { fetchSolarData, reverseGeocode } from './services/apiService';
import { calculateSolarPotential, validateInputs } from './services/calculationService';
import { DEFAULT_LOCATION } from './utils/constants';
import './App.css';

function App() {
  // ==========================================
  // State Management
  // ==========================================
  // Think of state as the app's memory - it remembers things like:
  // - Where the user clicked on the map
  // - What they typed in the form
  // - The calculation results
  // - Any errors that happened

  // Form data - all the inputs from the user
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
    roofArea: '',
    panelEfficiency: '18', // Default to Monocrystalline (18%)
    electricityRate: '8'   // Default electricity rate in India
  });

  // Map position - where the marker is on the map
  const [mapPosition, setMapPosition] = useState({
    lat: DEFAULT_LOCATION.latitude,
    lng: DEFAULT_LOCATION.longitude
  });

  // Calculation results - the numbers we show after calculating
  const [results, setResults] = useState(null);

  // Solar data from NASA - raw data from the API
  const [solarData, setSolarData] = useState(null);

  // Loading state - are we currently calculating?
  const [isCalculating, setIsCalculating] = useState(false);

  // Error message - if something goes wrong, we show this
  const [error, setError] = useState(null);

  // Results visibility - should we show the results section?
  const [showResults, setShowResults] = useState(false);

  // ==========================================
  // Event Handlers
  // ==========================================
  // These functions respond to user actions

  /**
   * When user clicks on the map
   * Update the marker position and form coordinates
   */
  const handleLocationSelect = async (lat, lng) => {
    // Update map marker
    setMapPosition({ lat, lng });

    // Update form inputs
    setFormData({
      ...formData,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6)
    });

    // Try to get the location name (optional, not critical)
    try {
      const locationName = await reverseGeocode(lat, lng);
      if (locationName) {
        console.log('Location:', locationName);
      }
    } catch (err) {
      // Reverse geocoding failed, but that's okay
      console.log('Could not get location name');
    }
  };

  /**
   * When user finds a location through search
   * Update both map and form
   */
  const handleLocationFound = (location) => {
    setMapPosition({ lat: location.lat, lng: location.lng });
    setFormData({
      ...formData,
      latitude: location.lat.toFixed(6),
      longitude: location.lng.toFixed(6)
    });
    setError(null); // Clear any previous errors
  };

  /**
   * When user changes form inputs
   * Update the form data
   */
  const handleFormChange = (newFormData) => {
    setFormData(newFormData);

    // If user manually changed coordinates, update map marker
    const lat = parseFloat(newFormData.latitude);
    const lng = parseFloat(newFormData.longitude);

    if (!isNaN(lat) && !isNaN(lng) &&
      lat >= -90 && lat <= 90 &&
      lng >= -180 && lng <= 180) {
      setMapPosition({ lat, lng });
    }
  };

  /**
   * When user clicks "Calculate Solar Potential"
   * This is where the magic happens!
   */
  const handleCalculate = async () => {
    // Clear any previous errors and results
    setError(null);
    setShowResults(false);

    // Get all the form values
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    const roofArea = parseFloat(formData.roofArea);
    const efficiency = parseFloat(formData.panelEfficiency);
    const rate = parseFloat(formData.electricityRate);

    // Step 1: Validate all inputs
    const validation = validateInputs(lat, lng, roofArea, efficiency, rate);
    if (!validation.isValid) {
      setError(validation.error);
      return; // Stop here if validation failed
    }

    try {
      setIsCalculating(true); // Show loading spinner

      // Step 2: Fetch solar data from NASA (through our backend)
      console.log('Fetching solar data for:', lat, lng);
      const solarResponse = await fetchSolarData(lat, lng);

      if (!solarResponse || !solarResponse.data) {
        throw new Error('Invalid response from server');
      }

      // Step 3: Calculate solar potential using the formulas
      const calculationResults = calculateSolarPotential(
        roofArea,
        efficiency,
        rate,
        solarResponse.data.averageDailyIrradiance
      );

      // Step 4: Save and display the results
      setSolarData(solarResponse);
      setResults(calculationResults);
      setShowResults(true);

      // Scroll to results section smoothly
      setTimeout(() => {
        const resultsSection = document.querySelector('.results-section');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

    } catch (err) {
      // Something went wrong - show error message
      console.error('Calculation error:', err);
      setError(err.message || 'Failed to calculate solar potential. Please try again.');
    } finally {
      setIsCalculating(false); // Hide loading spinner
    }
  };

  /**
   * Handle errors from child components
   */
  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  /**
   * Clear error message
   */
  const clearError = () => {
    setError(null);
  };

  // ==========================================
  // Render the UI
  // ==========================================
  return (
    <div className="App">
      {/* Top banner with logo and title */}
      <Header />

      {/* Main content area */}
      <main className="main-content">
        <div className="container">

          {/* Two-column layout: Form on left, Map on right */}
          <div className="grid-layout">

            {/* Left column: Input form */}
            <CalculatorForm
              formData={formData}
              onFormChange={handleFormChange}
              onLocationFound={handleLocationFound}
              onCalculate={handleCalculate}
              isCalculating={isCalculating}
              onError={handleError}
            />

            {/* Right column: Interactive map */}
            <MapView
              position={mapPosition}
              onLocationSelect={handleLocationSelect}
            />
          </div>

          {/* Error message (only shows if there's an error) */}
          <ErrorMessage message={error} onClose={clearError} />

          {/* Results section (only shows after calculation) */}
          <ResultsSection
            results={results}
            solarData={solarData}
            formData={formData}
            isVisible={showResults}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>Solar Potential Calculator | 6th Semester NON-CRT Project</p>
          <p className="footer-note">
            Built with NASA POWER API, Leaflet Maps, and Chart.js
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
