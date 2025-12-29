// ====================================
// Solar Calculation Service
// ====================================
// This file contains all the math for calculating solar energy potential
// It takes your roof size, panel type, and solar data to estimate savings

import { CO2_FACTOR } from '../utils/constants';

/**
 * Calculate how much solar energy you can generate and how much money you'll save
 * 
 * How it works:
 * 1. Takes your roof area and multiplies by panel efficiency
 * 2. Multiplies by daily sunlight to get daily energy
 * 3. Multiplies by 365 days to get yearly energy
 * 4. Calculates savings based on your electricity rate
 * 5. Calculates CO2 reduction based on grid emissions
 * 
 * @param {number} roofArea - Size of your roof in square meters
 * @param {number} efficiency - Panel efficiency as a percentage (e.g., 18 for 18%)
 * @param {number} electricityRate - Cost per kWh in rupees
 * @param {number} avgDailyIrradiance - Average daily sunlight in kWh/m²/day
 * @returns {object} All the calculated results
 */
export function calculateSolarPotential(roofArea, efficiency, electricityRate, avgDailyIrradiance) {
    // Convert efficiency from percentage to decimal
    // For example: 18% becomes 0.18
    const efficiencyDecimal = efficiency / 100;

    // Calculate annual energy generation
    // Formula: Roof Area × Panel Efficiency × Daily Sunlight × 365 days
    // This gives us total kWh produced per year
    const annualEnergy = roofArea * efficiencyDecimal * avgDailyIrradiance * 365;

    // Calculate how much money you save per year
    // Formula: Annual Energy × Your Electricity Rate
    // For example: 5000 kWh × ₹8 = ₹40,000 saved per year
    const annualSavings = annualEnergy * electricityRate;

    // Calculate CO2 emission reduction
    // Every kWh of solar energy saves 0.82 kg of CO2 emissions
    // This is how much pollution you prevent by using solar instead of grid power
    const co2Saved = annualEnergy * CO2_FACTOR;

    // Return all the results in a nice package
    return {
        annualEnergy: Math.round(annualEnergy), // Total kWh per year
        annualSavings: Math.round(annualSavings), // Total rupees saved per year
        co2Saved: Math.round(co2Saved), // Total kg of CO2 prevented per year
        avgDailyIrradiance: avgDailyIrradiance, // Daily sunlight (for display)
        dailyEnergy: (annualEnergy / 365).toFixed(2), // Average kWh per day
        monthlySavings: Math.round(annualSavings / 12) // Average savings per month
    };
}

/**
 * Validate user inputs before calculating
 * Makes sure all the numbers are reasonable and within expected ranges
 * 
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} roofArea - Roof area in m²
 * @param {number} efficiency - Panel efficiency percentage
 * @param {number} rate - Electricity rate
 * @returns {object} { isValid: boolean, error: string }
 */
export function validateInputs(lat, lon, roofArea, efficiency, rate) {
    // Check if location coordinates are provided
    if (isNaN(lat) || isNaN(lon)) {
        return {
            isValid: false,
            error: 'Please select a location on the map or enter coordinates.'
        };
    }

    // Check if latitude is within valid range (-90 to 90 degrees)
    if (lat < -90 || lat > 90) {
        return {
            isValid: false,
            error: 'Latitude must be between -90 and 90 degrees.'
        };
    }

    // Check if longitude is within valid range (-180 to 180 degrees)
    if (lon < -180 || lon > 180) {
        return {
            isValid: false,
            error: 'Longitude must be between -180 and 180 degrees.'
        };
    }

    // Check if roof area is a positive number
    if (isNaN(roofArea) || roofArea <= 0) {
        return {
            isValid: false,
            error: 'Please enter a valid roof area (greater than 0).'
        };
    }

    // Check if roof area is realistic (not too large)
    if (roofArea > 10000) {
        return {
            isValid: false,
            error: 'Roof area seems too large. Please enter a realistic value.'
        };
    }

    // Check if panel efficiency is within expected range
    if (isNaN(efficiency) || efficiency < 15 || efficiency > 22) {
        return {
            isValid: false,
            error: 'Panel efficiency must be between 15% and 22%.'
        };
    }

    // Check if electricity rate is a positive number
    if (isNaN(rate) || rate <= 0) {
        return {
            isValid: false,
            error: 'Please enter a valid electricity rate.'
        };
    }

    // All checks passed!
    return { isValid: true, error: null };
}
