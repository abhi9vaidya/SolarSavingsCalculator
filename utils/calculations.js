/**
 * Solar Calculations Utility Module
 * 
 * This module contains all the mathematical formulas used for
 * calculating solar energy potential. It can be used independently
 * of the main application for testing or integration with other systems.
 * 
 * ============================================
 * CALCULATION FORMULAS (Important for Viva!)
 * ============================================
 * 
 * 1. Annual Solar Energy Generation:
 *    Annual Energy (kWh) = Roof Area × Panel Efficiency × Avg Daily Irradiance × 365
 *    
 *    Where:
 *    - Roof Area is in square meters (m²)
 *    - Panel Efficiency is a decimal (e.g., 0.18 for 18%)
 *    - Avg Daily Irradiance is in kWh/m²/day
 *    - 365 is the number of days in a year
 * 
 * 2. Annual Cost Savings:
 *    Annual Savings (₹) = Annual Energy × Electricity Rate
 *    
 *    Where:
 *    - Annual Energy is in kWh
 *    - Electricity Rate is in ₹/kWh
 * 
 * 3. CO₂ Emission Reduction:
 *    CO₂ Saved (kg/year) = Annual Energy × 0.82
 *    
 *    Where:
 *    - 0.82 kg CO₂/kWh is the grid emission factor for India
 *    - This represents average CO₂ emissions from thermal power plants
 * 
 * ============================================
 * ASSUMPTIONS & LIMITATIONS
 * ============================================
 * 
 * 1. System losses are not included (simplified for academic purposes)
 *    - Real-world systems have 10-25% losses from inverters, wiring, dirt, etc.
 * 
 * 2. Panel degradation over time is not considered
 *    - Panels typically lose 0.5-1% efficiency per year
 * 
 * 3. Roof orientation and tilt are not factored
 *    - Optimal tilt equals latitude; south-facing is ideal in Northern Hemisphere
 * 
 * 4. Shading from nearby objects is not considered
 *    - Trees, buildings can significantly reduce output
 * 
 * 5. Temperature effects are not included
 *    - High temperatures reduce panel efficiency
 * 
 * These simplifications are acceptable for an educational project
 * but should be considered for commercial-grade applications.
 */

// ============================================
// Constants
// ============================================

/**
 * Grid emission factor for India (kg CO₂ per kWh)
 * Source: Central Electricity Authority (CEA), India
 * This represents the average CO₂ emissions from electricity generation
 */
const CO2_EMISSION_FACTOR = 0.82;

/**
 * Default panel efficiency assumptions
 */
const PANEL_EFFICIENCY = {
    MIN: 15,      // Older polycrystalline panels
    DEFAULT: 18,  // Standard monocrystalline panels
    MAX: 22       // High-efficiency panels (e.g., SunPower)
};

/**
 * Days in each month (for monthly calculations)
 */
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// ============================================
// Core Calculation Functions
// ============================================

/**
 * Calculate annual solar energy generation
 * 
 * @param {number} roofArea - Roof area in square meters
 * @param {number} efficiency - Panel efficiency as percentage (15-22)
 * @param {number} avgDailyIrradiance - Average daily irradiance in kWh/m²/day
 * @returns {number} Annual energy generation in kWh/year
 */
function calculateAnnualEnergy(roofArea, efficiency, avgDailyIrradiance) {
    // Validate inputs
    if (roofArea <= 0 || efficiency <= 0 || avgDailyIrradiance <= 0) {
        return 0;
    }

    // Convert efficiency from percentage to decimal
    const efficiencyDecimal = efficiency / 100;

    // Calculate annual energy
    // Formula: Roof Area × Efficiency × Irradiance × 365 days
    const annualEnergy = roofArea * efficiencyDecimal * avgDailyIrradiance * 365;

    return Math.round(annualEnergy * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate annual cost savings
 * 
 * @param {number} annualEnergy - Annual energy generation in kWh
 * @param {number} electricityRate - Electricity rate in ₹/kWh
 * @returns {number} Annual savings in ₹
 */
function calculateAnnualSavings(annualEnergy, electricityRate) {
    if (annualEnergy <= 0 || electricityRate <= 0) {
        return 0;
    }

    return Math.round(annualEnergy * electricityRate);
}

/**
 * Calculate CO₂ emission reduction
 * 
 * @param {number} annualEnergy - Annual energy generation in kWh
 * @returns {number} CO₂ saved in kg/year
 */
function calculateCO2Reduction(annualEnergy) {
    if (annualEnergy <= 0) {
        return 0;
    }

    return Math.round(annualEnergy * CO2_EMISSION_FACTOR);
}

/**
 * Calculate monthly energy generation
 * Uses irradiance data for each month to calculate more accurate estimates
 * 
 * @param {number} roofArea - Roof area in square meters
 * @param {number} efficiency - Panel efficiency as percentage
 * @param {Array} monthlyIrradiance - Array of 12 monthly irradiance values
 * @returns {Array} Array of 12 monthly energy values in kWh
 */
function calculateMonthlyEnergy(roofArea, efficiency, monthlyIrradiance) {
    if (!Array.isArray(monthlyIrradiance) || monthlyIrradiance.length !== 12) {
        console.error('Invalid monthly irradiance data');
        return Array(12).fill(0);
    }

    const efficiencyDecimal = efficiency / 100;

    return monthlyIrradiance.map((irradiance, index) => {
        const days = DAYS_IN_MONTH[index];
        const monthlyEnergy = roofArea * efficiencyDecimal * irradiance * days;
        return Math.round(monthlyEnergy * 10) / 10; // Round to 1 decimal
    });
}

// ============================================
// Helper Functions
// ============================================

/**
 * Calculate all solar metrics at once
 * Convenience function that returns all calculations in one object
 * 
 * @param {Object} params - Input parameters
 * @param {number} params.roofArea - Roof area in m²
 * @param {number} params.efficiency - Panel efficiency (%)
 * @param {number} params.electricityRate - Rate in ₹/kWh
 * @param {number} params.avgDailyIrradiance - Avg daily irradiance
 * @returns {Object} All calculated metrics
 */
function calculateAll(params) {
    const { roofArea, efficiency, electricityRate, avgDailyIrradiance } = params;

    const annualEnergy = calculateAnnualEnergy(roofArea, efficiency, avgDailyIrradiance);
    const annualSavings = calculateAnnualSavings(annualEnergy, electricityRate);
    const co2Saved = calculateCO2Reduction(annualEnergy);

    return {
        annualEnergy,
        annualSavings,
        co2Saved,
        dailyEnergy: (annualEnergy / 365).toFixed(2),
        monthlyEnergy: (annualEnergy / 12).toFixed(2),
        monthlySavings: Math.round(annualSavings / 12),
        // Additional context
        assumptions: {
            panelEfficiency: efficiency + '%',
            electricityRate: '₹' + electricityRate + '/kWh',
            co2Factor: CO2_EMISSION_FACTOR + ' kg CO₂/kWh'
        }
    };
}

/**
 * Estimate payback period (optional enhancement)
 * 
 * @param {number} systemCost - Total installation cost in ₹
 * @param {number} annualSavings - Annual savings in ₹
 * @returns {number} Payback period in years
 */
function estimatePaybackPeriod(systemCost, annualSavings) {
    if (annualSavings <= 0) {
        return Infinity;
    }

    return Math.round((systemCost / annualSavings) * 10) / 10;
}

/**
 * Format currency value for display
 * @param {number} value - Value to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(value) {
    return '₹' + value.toLocaleString('en-IN');
}

/**
 * Format energy value for display
 * @param {number} value - Value in kWh
 * @returns {string} Formatted energy string
 */
function formatEnergy(value) {
    return value.toLocaleString('en-IN') + ' kWh';
}

// ============================================
// Export for use in other modules
// ============================================

// Check if running in Node.js or browser
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        calculateAnnualEnergy,
        calculateAnnualSavings,
        calculateCO2Reduction,
        calculateMonthlyEnergy,
        calculateAll,
        estimatePaybackPeriod,
        formatCurrency,
        formatEnergy,
        CO2_EMISSION_FACTOR,
        PANEL_EFFICIENCY,
        DAYS_IN_MONTH
    };
} else {
    // Browser environment - attach to window
    window.SolarCalculations = {
        calculateAnnualEnergy,
        calculateAnnualSavings,
        calculateCO2Reduction,
        calculateMonthlyEnergy,
        calculateAll,
        estimatePaybackPeriod,
        formatCurrency,
        formatEnergy,
        CO2_EMISSION_FACTOR,
        PANEL_EFFICIENCY,
        DAYS_IN_MONTH
    };
}
