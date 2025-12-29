// ====================================
// API Service
// ====================================
// This file handles all communication with our backend server
// It fetches solar data from NASA's database through our backend

import axios from 'axios';

// Base URL for our API
// In development, this goes through Vite's proxy to localhost:3000
// In production, it uses the same domain as the website
const API_BASE_URL = '/api';

/**
 * Fetch solar irradiance data for a specific location
 * 
 * This function asks our backend server to get solar data from NASA
 * The backend then processes it and sends it back to us
 * 
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @returns {Promise} Solar data from NASA POWER API
 */
export async function fetchSolarData(latitude, longitude) {
    try {
        // Make the API call to our backend
        // The backend will fetch data from NASA and return it to us
        const response = await axios.get(`${API_BASE_URL}/solar`, {
            params: {
                lat: latitude,
                lon: longitude
            }
        });

        // Return the data we got back
        return response.data;

    } catch (error) {
        // If something went wrong, create a helpful error message
        console.error('Error fetching solar data:', error);

        // Check if we got an error message from the server
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        }

        // Otherwise, use a generic error message
        throw new Error('Failed to fetch solar data. Please check your internet connection and try again.');
    }
}

/**
 * Search for a location by name using Nominatim (OpenStreetMap)
 * 
 * This is a free geocoding service that converts place names to coordinates
 * For example: "New Delhi" → { lat: 28.6139, lon: 77.2090 }
 * 
 * @param {string} query - Location name to search for
 * @returns {Promise} Location data with coordinates
 */
export async function searchLocation(query) {
    try {
        // Call the Nominatim API
        // We use OpenStreetMap's free geocoding service
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/search`,
            {
                params: {
                    q: query,
                    format: 'json',
                    limit: 1 // We only need the best match
                }
            }
        );

        // Check if we found any results
        if (response.data && response.data.length > 0) {
            return response.data[0]; // Return the first (best) result
        } else {
            throw new Error('Location not found. Try a different search term.');
        }

    } catch (error) {
        console.error('Location search failed:', error);
        throw new Error('Failed to search location. Please try again.');
    }
}

/**
 * Reverse geocode - convert coordinates to a place name
 * 
 * This does the opposite of searchLocation
 * For example: { lat: 28.6139, lon: 77.2090 } → "New Delhi, India"
 * 
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @returns {Promise} Location name
 */
export async function reverseGeocode(latitude, longitude) {
    try {
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse`,
            {
                params: {
                    lat: latitude,
                    lon: longitude,
                    format: 'json'
                }
            }
        );

        // Return a shortened version of the address (first 3 parts)
        // For example: "Connaught Place, New Delhi, India"
        if (response.data && response.data.display_name) {
            return response.data.display_name.split(',').slice(0, 3).join(',');
        }

        return null;

    } catch (error) {
        // Reverse geocoding is not critical, so we just log the error
        console.log('Reverse geocoding failed:', error.message);
        return null;
    }
}
