// validate user inputs
export const validateInputs = (lat, lng, roofArea, efficiency, rate) => {
    // check required fields
    if (!lat || !lng) return { isValid: false, error: 'Please select a location on the map.' };
    if (!roofArea || roofArea <= 0) return { isValid: false, error: 'Enter a valid roof area.' };

    return { isValid: true };
};

// core solar calc logic
export const calculateSolarPotential = (roofArea, efficiency, rate, avgDailyIrradiance) => {

    const efficiencyDecimal = efficiency / 100;

    // formula: area * eff * sun * 365
    const annualEnergy = roofArea * efficiencyDecimal * avgDailyIrradiance * 365;

    // savings: energy * rate
    const annualSavings = annualEnergy * rate;

    // co2: energy * 0.82 (india avg)
    const co2Factor = 0.82;
    const co2Saved = annualEnergy * co2Factor;

    return {
        annualEnergy: Math.round(annualEnergy),
        annualSavings: Math.round(annualSavings),
        co2Saved: Math.round(co2Saved),
        avgDailyIrradiance: avgDailyIrradiance,
        // extras for charts
        dailyEnergy: (annualEnergy / 365).toFixed(2),
        monthlySavings: Math.round(annualSavings / 12)
    };
};
