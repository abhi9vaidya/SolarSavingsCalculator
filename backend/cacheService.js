/**
 * Cache Service for Solar Potential Calculator
 * 
 * This module provides in-memory caching to reduce redundant API calls
 * to the NASA POWER API. Since solar irradiance data doesn't change rapidly,
 * caching responses for a period helps improve performance and reduces
 * the load on external APIs.
 * 
 * Cache Strategy:
 * - Uses node-cache for simple in-memory storage
 * - Default TTL (Time To Live): 24 hours (solar data is daily averages)
 * - Cache key based on latitude and longitude (rounded to 2 decimal places)
 */

const NodeCache = require('node-cache');

// Initialize cache with default TTL of 24 hours (86400 seconds)
// checkperiod: How often to check for expired entries (600 seconds = 10 minutes)
const cache = new NodeCache({
    stdTTL: 86400,
    checkperiod: 600,
    useClones: false // For better performance with large objects
});

/**
 * Generate a cache key from coordinates
 * Rounds to 2 decimal places to group nearby locations
 * (reduces cache misses for very similar coordinates)
 * 
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {string} Cache key
 */
function generateKey(lat, lon) {
    const roundedLat = Math.round(lat * 100) / 100;
    const roundedLon = Math.round(lon * 100) / 100;
    return `solar_${roundedLat}_${roundedLon}`;
}

/**
 * Get cached solar data for given coordinates
 * 
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {object|null} Cached data or null if not found
 */
function get(lat, lon) {
    const key = generateKey(lat, lon);
    const data = cache.get(key);

    if (data) {
        console.log(`Cache HIT for location: ${lat}, ${lon}`);
        return data;
    }

    console.log(`Cache MISS for location: ${lat}, ${lon}`);
    return null;
}

/**
 * Store solar data in cache
 * 
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {object} data - Solar data to cache
 * @returns {boolean} True if successfully cached
 */
function set(lat, lon, data) {
    const key = generateKey(lat, lon);
    return cache.set(key, data);
}

/**
 * Get cache statistics (useful for debugging/monitoring)
 * 
 * @returns {object} Cache statistics
 */
function getStats() {
    return cache.getStats();
}

/**
 * Clear all cached data
 * (useful for testing or when data needs to be refreshed)
 */
function clear() {
    cache.flushAll();
    console.log('Cache cleared');
}

module.exports = {
    get,
    set,
    getStats,
    clear
};
