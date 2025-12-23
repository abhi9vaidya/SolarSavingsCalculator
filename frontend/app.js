/**
 * Solar Potential Calculator - Main Application
 * 
 * This is the main JavaScript file that handles:
 * - Map initialization with Leaflet and OpenStreetMap
 * - Satellite imagery toggle using Mapbox
 * - Location selection (click on map or search)
 * - Form handling and validation
 * - API calls to backend for solar data
 * - Results calculation and display
 * 
 * Educational Note:
 * Satellite imagery is used for visual validation of location only.
 * Roof area is manually entered by users to maintain accuracy
 * and keep the project within academic scope.
 */

// ============================================
// Global Variables
// ============================================

let map = null;
let marker = null;
let satelliteLayer = null;
let streetLayer = null;
let isSatelliteView = false;

// API Configuration
const API_BASE_URL = window.location.origin.includes('localhost')
    ? 'http://localhost:3000'
    : window.location.origin;

// ============================================
// Map Initialization
// ============================================

/**
 * Initialize Leaflet map with OpenStreetMap tiles
 * Sets default view to India (for this project context)
 */
function initializeMap() {
    // Default coordinates (New Delhi, India)
    const defaultLat = 28.6139;
    const defaultLng = 77.2090;
    const defaultZoom = 5;

    // Create map instance
    map = L.map('map', {
        center: [defaultLat, defaultLng],
        zoom: defaultZoom,
        scrollWheelZoom: true
    });

    // OpenStreetMap tile layer (default street view)
    streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Satellite tile layer (using ESRI World Imagery - free alternative to Mapbox)
    // Note: For production, consider using Mapbox with API key for higher quality
    satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 19
    });

    // Add click handler to map
    map.on('click', onMapClick);

    console.log('Map initialized successfully');
}

/**
 * Handle map click - place marker and update coordinates
 * @param {Object} e - Leaflet click event
 */
function onMapClick(e) {
    const { lat, lng } = e.latlng;

    // Update marker position
    updateMarker(lat, lng);

    // Update form inputs
    document.getElementById('latitude').value = lat.toFixed(6);
    document.getElementById('longitude').value = lng.toFixed(6);

    // Reverse geocode to get location name (optional enhancement)
    reverseGeocode(lat, lng);
}

/**
 * Update or create marker at given position
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 */
function updateMarker(lat, lng) {
    const customIcon = L.divIcon({
        html: '<div style="font-size: 32px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">📍</div>',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        className: 'custom-marker'
    });

    if (marker) {
        marker.setLatLng([lat, lng]);
    } else {
        marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
    }

    // Center map on marker with smooth animation
    map.flyTo([lat, lng], Math.max(map.getZoom(), 12), {
        duration: 1
    });
}

/**
 * Toggle between street view and satellite view
 */
function toggleSatelliteView() {
    isSatelliteView = !isSatelliteView;

    const toggleBtn = document.getElementById('toggleSatellite');

    if (isSatelliteView) {
        map.removeLayer(streetLayer);
        map.addLayer(satelliteLayer);
        toggleBtn.textContent = '🗺️ Street View';
        toggleBtn.classList.add('active');
    } else {
        map.removeLayer(satelliteLayer);
        map.addLayer(streetLayer);
        toggleBtn.textContent = '🛰️ Toggle Satellite View';
        toggleBtn.classList.remove('active');
    }
}

/**
 * Reverse geocode coordinates to get location name
 * Uses Nominatim (OpenStreetMap) - free, no API key required
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 */
async function reverseGeocode(lat, lng) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await response.json();

        if (data.display_name) {
            // Update search input with location name
            document.getElementById('locationSearch').value = data.display_name.split(',').slice(0, 3).join(',');
        }
    } catch (error) {
        console.log('Reverse geocoding failed:', error.message);
        // Not critical - silently fail
    }
}

/**
 * Search for a location by name
 * Uses Nominatim geocoding API
 * @param {string} query - Location search query
 */
async function searchLocation(query) {
    if (!query.trim()) return;

    try {
        showLoading(true);

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
        );
        const data = await response.json();

        if (data.length > 0) {
            const { lat, lon, display_name } = data[0];

            // Update marker and inputs
            updateMarker(parseFloat(lat), parseFloat(lon));
            document.getElementById('latitude').value = parseFloat(lat).toFixed(6);
            document.getElementById('longitude').value = parseFloat(lon).toFixed(6);
            document.getElementById('locationSearch').value = display_name.split(',').slice(0, 3).join(',');
        } else {
            showError('Location not found. Try a different search term.');
        }
    } catch (error) {
        console.error('Location search failed:', error);
        showError('Failed to search location. Please try again.');
    } finally {
        showLoading(false);
    }
}

// ============================================
// Form Handling
// ============================================

/**
 * Handle form submission
 * @param {Event} e - Form submit event
 */
async function handleFormSubmit(e) {
    e.preventDefault();

    // Get form values
    const latitude = parseFloat(document.getElementById('latitude').value);
    const longitude = parseFloat(document.getElementById('longitude').value);
    const roofArea = parseFloat(document.getElementById('roofArea').value);
    const panelEfficiency = parseFloat(document.getElementById('panelEfficiency').value);
    const electricityRate = parseFloat(document.getElementById('electricityRate').value);

    // Validate inputs
    if (!validateInputs(latitude, longitude, roofArea, panelEfficiency, electricityRate)) {
        return;
    }

    try {
        showLoading(true);
        hideError();
        hideResults();

        // Fetch solar data from backend
        const solarData = await fetchSolarData(latitude, longitude);

        if (!solarData || !solarData.data) {
            throw new Error('Invalid response from server');
        }

        // Calculate results
        const results = calculateSolarPotential(
            roofArea,
            panelEfficiency,
            electricityRate,
            solarData.data.averageDailyIrradiance
        );

        // Display results
        displayResults(results, solarData.data);

        // Update chart
        if (solarData.data.monthlyData && solarData.data.monthlyData.length === 12) {
            window.SolarCharts.updateChart(solarData.data.monthlyData, roofArea, panelEfficiency);
        } else {
            window.SolarCharts.updateChartWithAnnualData(results.annualEnergy);
        }

    } catch (error) {
        console.error('Calculation error:', error);
        showError(error.message || 'Failed to calculate solar potential. Please try again.');
    } finally {
        showLoading(false);
    }
}

/**
 * Validate form inputs
 * @returns {boolean} True if all inputs are valid
 */
function validateInputs(lat, lon, roofArea, efficiency, rate) {
    // Check for required fields
    if (isNaN(lat) || isNaN(lon)) {
        showError('Please select a location on the map or enter coordinates.');
        return false;
    }

    // Validate latitude range
    if (lat < -90 || lat > 90) {
        showError('Latitude must be between -90 and 90 degrees.');
        return false;
    }

    // Validate longitude range
    if (lon < -180 || lon > 180) {
        showError('Longitude must be between -180 and 180 degrees.');
        return false;
    }

    // Validate roof area
    if (isNaN(roofArea) || roofArea <= 0) {
        showError('Please enter a valid roof area (greater than 0).');
        return false;
    }

    if (roofArea > 10000) {
        showError('Roof area seems too large. Please enter a realistic value.');
        return false;
    }

    // Validate panel efficiency
    if (isNaN(efficiency) || efficiency < 15 || efficiency > 22) {
        showError('Panel efficiency must be between 15% and 22%.');
        return false;
    }

    // Validate electricity rate
    if (isNaN(rate) || rate <= 0) {
        showError('Please enter a valid electricity rate.');
        return false;
    }

    return true;
}

// ============================================
// API Calls
// ============================================

/**
 * Fetch solar irradiance data from backend API
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Solar data from NASA POWER API
 */
async function fetchSolarData(lat, lon) {
    const url = `${API_BASE_URL}/api/solar?lat=${lat}&lon=${lon}`;

    console.log('Fetching solar data from:', url);

    const response = await fetch(url);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch solar data');
    }

    return await response.json();
}

// ============================================
// Calculations
// ============================================

/**
 * Calculate solar energy potential
 * 
 * Formulas (as specified in project requirements):
 * 
 * Annual Energy (kWh) = Roof Area × Panel Efficiency × Avg Daily Irradiance × 365
 * Annual Savings (₹) = Annual Energy × Electricity Rate
 * CO₂ Saved (kg/year) = Annual Energy × 0.82
 * 
 * @param {number} roofArea - Roof area in square meters
 * @param {number} efficiency - Panel efficiency as percentage
 * @param {number} electricityRate - Electricity rate in ₹/kWh
 * @param {number} avgDailyIrradiance - Average daily solar irradiance in kWh/m²/day
 * @returns {Object} Calculated results
 */
function calculateSolarPotential(roofArea, efficiency, electricityRate, avgDailyIrradiance) {
    // Convert efficiency from percentage to decimal
    const efficiencyDecimal = efficiency / 100;

    // Annual Energy Generation (kWh/year)
    // Formula: Roof Area × Panel Efficiency × Avg Daily Irradiance × 365 days
    const annualEnergy = roofArea * efficiencyDecimal * avgDailyIrradiance * 365;

    // Annual Cost Savings (₹/year)
    // Formula: Annual Energy × Electricity Rate
    const annualSavings = annualEnergy * electricityRate;

    // CO₂ Emission Reduction (kg/year)
    // Using 0.82 kg CO₂ per kWh as standard grid emission factor (India average)
    const co2Factor = 0.82;
    const co2Saved = annualEnergy * co2Factor;

    return {
        annualEnergy: Math.round(annualEnergy),
        annualSavings: Math.round(annualSavings),
        co2Saved: Math.round(co2Saved),
        avgDailyIrradiance: avgDailyIrradiance,
        // Additional useful calculations
        dailyEnergy: (annualEnergy / 365).toFixed(2),
        monthlySavings: Math.round(annualSavings / 12)
    };
}

// ============================================
// Display Functions
// ============================================

/**
 * Display calculation results on the page
 * @param {Object} results - Calculated results
 * @param {Object} solarData - Raw solar data from API
 */
function displayResults(results, solarData) {
    // Update result values with animation
    animateValue('annualEnergy', 0, results.annualEnergy, 1000);
    animateValue('annualSavings', 0, results.annualSavings, 1000);
    animateValue('co2Saved', 0, results.co2Saved, 1000);

    // Display average irradiance
    document.getElementById('avgIrradiance').textContent =
        solarData.averageDailyIrradiance.toFixed(2);

    // Show results section
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.classList.remove('hidden');

    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    console.log('Results displayed:', results);
}

/**
 * Animate a numeric value from start to end
 * @param {string} elementId - ID of the element to update
 * @param {number} start - Starting value
 * @param {number} end - Ending value
 * @param {number} duration - Animation duration in ms
 */
function animateValue(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const startTime = performance.now();
    const range = end - start;

    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);

        const currentValue = Math.round(start + range * easeOut);
        element.textContent = currentValue.toLocaleString('en-IN');

        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }

    requestAnimationFrame(updateValue);
}

/**
 * Hide results section
 */
function hideResults() {
    document.getElementById('resultsSection').classList.add('hidden');
}

// ============================================
// Loading & Error Handling
// ============================================

/**
 * Show/hide loading state
 * @param {boolean} isLoading - Whether to show loading state
 */
function showLoading(isLoading) {
    const btn = document.getElementById('calculateBtn');
    const btnText = btn.querySelector('.btn-text');
    const btnLoader = btn.querySelector('.btn-loader');

    if (isLoading) {
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');
        btn.disabled = true;
    } else {
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
        btn.disabled = false;
    }
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    errorText.textContent = message;
    errorDiv.classList.remove('hidden');

    // Scroll to error
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Hide error message
 */
function hideError() {
    document.getElementById('errorMessage').classList.add('hidden');
}

// ============================================
// Event Listeners
// ============================================

/**
 * Initialize application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function () {
    console.log('Solar Potential Calculator initializing...');

    // Initialize map
    initializeMap();

    // Initialize chart
    window.SolarCharts.initializeChart();

    // Form submission
    document.getElementById('solarForm').addEventListener('submit', handleFormSubmit);

    // Satellite toggle button
    document.getElementById('toggleSatellite').addEventListener('click', toggleSatelliteView);

    // Location search
    document.getElementById('searchBtn').addEventListener('click', function () {
        const query = document.getElementById('locationSearch').value;
        searchLocation(query);
    });

    // Search on Enter key
    document.getElementById('locationSearch').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchLocation(this.value);
        }
    });

    // Sync manual coordinate input with marker
    document.getElementById('latitude').addEventListener('change', updateMarkerFromInputs);
    document.getElementById('longitude').addEventListener('change', updateMarkerFromInputs);

    console.log('Solar Potential Calculator ready!');
});

/**
 * Update marker when user manually changes coordinates
 */
function updateMarkerFromInputs() {
    const lat = parseFloat(document.getElementById('latitude').value);
    const lon = parseFloat(document.getElementById('longitude').value);

    if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
        updateMarker(lat, lon);
    }
}
