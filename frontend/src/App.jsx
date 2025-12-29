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

// main component - connects everything together
function App() {

  // store form inputs
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
    roofArea: '',
    panelEfficiency: '18', // default 18%
    electricityRate: '8'   // default rate
  });

  // store map pin location
  const [mapPosition, setMapPosition] = useState({
    lat: DEFAULT_LOCATION.latitude,
    lng: DEFAULT_LOCATION.longitude
  });

  // store final calculations
  const [results, setResults] = useState(null);

  // store raw nasa api data
  const [solarData, setSolarData] = useState(null);

  // loading status
  const [isCalculating, setIsCalculating] = useState(false);

  // error message state
  const [error, setError] = useState(null);

  // toggle results view
  const [showResults, setShowResults] = useState(false);

  // click map -> update marker and form coords
  const handleLocationSelect = async (lat, lng) => {
    setMapPosition({ lat, lng });

    setFormData({
      ...formData,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6)
    });

    // try getting place name (not required but nice to have)
    try {
      const locationName = await reverseGeocode(lat, lng);
      if (locationName) console.log('loc:', locationName);
    } catch (err) {
      console.log('geo fail');
    }
  };

  // search location -> update map and form
  const handleLocationFound = (location) => {
    setMapPosition({ lat: location.lat, lng: location.lng });
    setFormData({
      ...formData,
      latitude: location.lat.toFixed(6),
      longitude: location.lng.toFixed(6)
    });
    setError(null);
  };

  // form input change -> update state
  const handleFormChange = (newFormData) => {
    setFormData(newFormData);

    // sync map if user types coords manually
    const lat = parseFloat(newFormData.latitude);
    const lng = parseFloat(newFormData.longitude);

    if (!isNaN(lat) && !isNaN(lng) &&
      lat >= -90 && lat <= 90 &&
      lng >= -180 && lng <= 180) {
      setMapPosition({ lat, lng });
    }
  };

  // calculate button clicked -> validate & fetch data
  const handleCalculate = async () => {
    setError(null);
    setShowResults(false);

    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    const roofArea = parseFloat(formData.roofArea);
    const efficiency = parseFloat(formData.panelEfficiency);
    const rate = parseFloat(formData.electricityRate);

    // check if inputs are valid
    const validation = validateInputs(lat, lng, roofArea, efficiency, rate);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    try {
      setIsCalculating(true);

      // get solar data from backend
      console.log('fetching data...', lat, lng);
      const solarResponse = await fetchSolarData(lat, lng);

      if (!solarResponse || !solarResponse.data) {
        throw new Error('bad server response');
      }

      // do the math
      const calculationResults = calculateSolarPotential(
        roofArea,
        efficiency,
        rate,
        solarResponse.data.averageDailyIrradiance
      );

      // save results and show them
      setSolarData(solarResponse);
      setResults(calculationResults);
      setShowResults(true);

      // scroll down to results
      setTimeout(() => {
        const resultsSection = document.querySelector('.results-section');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

    } catch (err) {
      console.error('calc error:', err);
      setError(err.message || 'calc failed, try again');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="App">
      <Header />

      <main className="main-content">
        <div className="container">

          <div className="grid-layout">

            {/* left: form inputs */}
            <CalculatorForm
              formData={formData}
              onFormChange={handleFormChange}
              onLocationFound={handleLocationFound}
              onCalculate={handleCalculate}
              isCalculating={isCalculating}
              onError={setError}
            />

            {/* right: map view */}
            <MapView
              position={mapPosition}
              onLocationSelect={handleLocationSelect}
            />
          </div>

          <ErrorMessage message={error} onClose={() => setError(null)} />

          <ResultsSection
            results={results}
            solarData={solarData}
            formData={formData}
            isVisible={showResults}
          />
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>Solar Potential Calculator | 6th Semester Project</p>
          <p className="footer-note">
            Powered by NASA POWER API & Leaflet
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
