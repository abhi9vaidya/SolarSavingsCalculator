/**
 * Solar Potential Calculator - Backend Server
 * 
 * This Express server provides API endpoints for fetching real-time solar data
 * from NASA POWER API. It acts as a middleware between the frontend and external APIs.
 * 
 * Why use a backend server?
 * - Handle CORS issues when calling external APIs
 * - Cache responses to reduce API calls
 * - Process and clean data before sending to frontend
 * - Hide API implementation details from client
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const solarApiService = require('./solarApiService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON request bodies

// Serve static files from frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

/**
 * Health check endpoint
 * Used to verify server is running
 */
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Solar Calculator API is running',
        timestamp: new Date().toISOString()
    });
});

/**
 * Solar Data API Endpoint
 * 
 * Fetches solar irradiance data from NASA POWER API for given coordinates
 * 
 * Query Parameters:
 * - lat: Latitude (-90 to 90)
 * - lon: Longitude (-180 to 180)
 * 
 * Returns:
 * - averageDailyIrradiance: Average daily solar irradiance (kWh/m²/day)
 * - monthlyData: Array of monthly average values
 * - location: Coordinates used for the query
 */
app.get('/api/solar', async (req, res) => {
    try {
        const { lat, lon } = req.query;

        // Validate input parameters
        if (!lat || !lon) {
            return res.status(400).json({
                error: 'Missing parameters',
                message: 'Both lat and lon query parameters are required'
            });
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        // Validate coordinate ranges
        if (isNaN(latitude) || latitude < -90 || latitude > 90) {
            return res.status(400).json({
                error: 'Invalid latitude',
                message: 'Latitude must be a number between -90 and 90'
            });
        }

        if (isNaN(longitude) || longitude < -180 || longitude > 180) {
            return res.status(400).json({
                error: 'Invalid longitude',
                message: 'Longitude must be a number between -180 and 180'
            });
        }

        // Fetch solar data from NASA POWER API
        const solarData = await solarApiService.getSolarData(latitude, longitude);
        
        res.json({
            success: true,
            data: solarData,
            location: { latitude, longitude }
        });

    } catch (error) {
        console.error('Error fetching solar data:', error.message);
        res.status(500).json({
            error: 'API Error',
            message: 'Failed to fetch solar data. Please try again later.'
        });
    }
});

// Serve frontend for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`
    ☀️  Solar Potential Calculator Server
    ====================================
    Server running on: http://localhost:${PORT}
    API Health Check:  http://localhost:${PORT}/api/health
    Solar Data API:    http://localhost:${PORT}/api/solar?lat=28.6&lon=77.2
    
    Ready to calculate solar potential!
    `);
});
