/**
 * NASA POWER API Service
 * 
 * This module handles all interactions with NASA's POWER (Prediction Of Worldwide
 * Energy Resources) API to fetch solar irradiance data.
 * 
 * API Choice Justification (Important for Viva):
 * - NASA POWER API is free and doesn't require authentication
 * - Provides reliable, scientific-grade solar radiation data
 * - Data is based on satellite observations and meteorological models
 * - Widely used in solar energy research and applications
 * 
 * Parameter Used: ALLSKY_SFC_SW_DWN
 * - "All Sky Surface Shortwave Downward Irradiance"
 * - Measures total solar radiation reaching the Earth's surface
 * - Unit: kWh/m²/day (kilowatt-hours per square meter per day)
 * - Accounts for cloud cover and atmospheric conditions
 */

const fetch = require('node-fetch');
const cacheService = require('./cacheService');

// NASA POWER API base URL
const NASA_POWER_API_BASE = 'https://power.larc.nasa.gov/api/temporal/monthly/point';

/**
 * Fetch solar irradiance data from NASA POWER API
 * 
 * @param {number} latitude - Location latitude (-90 to 90)
 * @param {number} longitude - Location longitude (-180 to 180)
 * @returns {Promise<object>} Solar data with averages and monthly values
 */
async function getSolarData(latitude, longitude) {
    // Check cache first
    const cachedData = cacheService.get(latitude, longitude);
    if (cachedData) {
        return cachedData;
    }

    // Build API URL
    // Using monthly temporal resolution for more accurate averages
    // Fetching data for the last complete year
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 1;
    const endYear = currentYear - 1;

    const apiUrl = `${NASA_POWER_API_BASE}?` + new URLSearchParams({
        parameters: 'ALLSKY_SFC_SW_DWN',
        community: 'RE', // Renewable Energy community
        longitude: longitude.toString(),
        latitude: latitude.toString(),
        start: startYear.toString(),
        end: endYear.toString(),
        format: 'JSON'
    });



    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`NASA API responded with status: ${response.status}`);
        }

        const rawData = await response.json();

        // Parse and process the response
        const processedData = processNasaResponse(rawData, latitude, longitude);

        // Cache the processed data
        cacheService.set(latitude, longitude, processedData);

        return processedData;

    } catch (error) {
        console.error('Error calling NASA POWER API:', error.message);
        throw new Error('Failed to fetch solar data from NASA POWER API');
    }
}

/**
 * Process NASA POWER API response into a clean format
 * 
 * @param {object} rawData - Raw API response
 * @param {number} latitude - Request latitude
 * @param {number} longitude - Request longitude
 * @returns {object} Processed solar data
 */
function processNasaResponse(rawData, latitude, longitude) {
    // Extract the irradiance data from nested response
    const parameters = rawData.properties?.parameter || {};
    const irradianceData = parameters.ALLSKY_SFC_SW_DWN || {};

    // Month names for display
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Process monthly data
    const monthlyData = [];
    let totalIrradiance = 0;
    let validMonths = 0;

    // Iterate through the year's data (keys are in format YYYYMM)
    Object.keys(irradianceData).forEach(key => {
        // Skip annual average key (ends with 13)
        if (key.endsWith('13')) return;

        const value = irradianceData[key];

        // Skip invalid/missing data (NASA uses -999 for missing)
        if (value < 0) return;

        const month = parseInt(key.slice(-2)) - 1; // Convert to 0-indexed

        monthlyData.push({
            month: monthNames[month],
            monthIndex: month,
            irradiance: parseFloat(value.toFixed(2))
        });

        totalIrradiance += value;
        validMonths++;
    });

    // Sort by month index
    monthlyData.sort((a, b) => a.monthIndex - b.monthIndex);

    // Calculate average daily irradiance
    const averageDailyIrradiance = validMonths > 0
        ? parseFloat((totalIrradiance / validMonths).toFixed(2))
        : 0;

    return {
        averageDailyIrradiance, // kWh/m²/day
        monthlyData,
        dataSource: 'NASA POWER API',
        parameter: 'ALLSKY_SFC_SW_DWN (All Sky Surface Shortwave Downward Irradiance)',
        unit: 'kWh/m²/day',
        location: {
            latitude,
            longitude
        },
        note: 'Solar irradiance data represents the average solar energy received per square meter per day'
    };
}

module.exports = {
    getSolarData
};
