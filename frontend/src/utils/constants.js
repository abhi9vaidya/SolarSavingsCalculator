// ====================================
// Constants & Configuration
// ====================================
// This file stores all the fixed values we use throughout the app
// Think of it as a settings file that we can easily update in one place

// Month names for our chart
export const MONTH_LABELS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

// Default location when the app first loads (New Delhi, India)
export const DEFAULT_LOCATION = {
    latitude: 28.6139,
    longitude: 77.2090,
    zoom: 5
};

// Different types of solar panels and their efficiency
// Higher efficiency means more power from the same roof area
export const PANEL_TYPES = [
    { value: 16, label: 'Standard Polycrystalline (16%)' },
    { value: 18, label: 'Monocrystalline (18%)', default: true },
    { value: 20, label: 'High-Efficiency Mono (20%)' },
    { value: 22, label: 'Premium - SunPower/LG (22%)' }
];

// How much CO2 is saved per kWh of solar energy
// This is the average for India's power grid
export const CO2_FACTOR = 0.82; // kg CO2 per kWh

// Number of days in each month (for calculations)
export const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// Seasonal variation factors for solar energy
// Summer months get more sun, winter months get less
// These help us estimate monthly generation from annual data
export const SEASONAL_FACTORS = [
    0.70,  // Jan - Winter, less sunlight
    0.80,  // Feb
    0.95,  // Mar - Spring begins
    1.05,  // Apr
    1.15,  // May
    1.20,  // Jun - Summer peak, maximum sunlight
    1.20,  // Jul
    1.15,  // Aug
    1.00,  // Sep - Fall begins
    0.90,  // Oct
    0.75,  // Nov
    0.65   // Dec - Winter, least sunlight
];
