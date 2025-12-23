# ☀️ Solar Potential Calculator

A web-based application that estimates rooftop solar energy potential using real-time NASA solar data and satellite imagery.

**6th Semester NON CRT Project**

---

## 🎯 Project Overview

This application helps users estimate their rooftop solar energy potential by combining:
- User-provided roof area
- Real-time solar irradiance data from NASA POWER API
- Interactive map with satellite imagery for location verification
- Dynamic electricity tariff-based savings calculation

### What it Calculates

1. **Annual Solar Energy Generation (kWh)**
2. **Estimated Annual Cost Savings (₹)**
3. **Environmental Impact (CO₂ Reduction)**

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3 (Modern, responsive design)
- JavaScript (Vanilla)
- Leaflet.js (Maps)
- Chart.js (Visualizations)

### Backend
- Node.js
- Express.js
- node-cache (API response caching)

### APIs & Services
- **NASA POWER API** - Real-time solar irradiance data
- **OpenStreetMap** - Interactive maps
- **ESRI World Imagery** - Satellite imagery
- **Nominatim** - Geocoding (location search)

---

## 📁 Project Structure

```
SolarSavingsCalculator/
├── backend/
│   ├── server.js           # Express server
│   ├── solarApiService.js  # NASA API integration
│   ├── cacheService.js     # Response caching
│   └── package.json        # Dependencies
├── frontend/
│   ├── index.html          # Main HTML structure
│   ├── styles.css          # CSS design system
│   ├── app.js              # Main application logic
│   └── charts.js           # Chart.js integration
└── utils/
    └── calculations.js     # Solar calculation formulas
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/abhi9vaidya/SolarSavingsCalculator.git
cd SolarSavingsCalculator
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📖 How to Use

1. **Select Location**
   - Click on the map to select your location, OR
   - Enter a city/address in the search box, OR
   - Manually enter latitude and longitude

2. **Toggle Satellite View**
   - Use the satellite button to verify your roof location visually

3. **Enter Parameters**
   - **Roof Area**: Enter your usable roof area in square meters
   - **Panel Efficiency**: Select solar panel efficiency (15-22%)
   - **Electricity Rate**: Enter your electricity cost per kWh

4. **Calculate**
   - Click "Calculate Solar Potential" to see results
   - View annual energy generation, cost savings, and CO₂ reduction
   - Check the monthly energy chart for seasonal variations

---

## 🧮 Calculation Formulas

### Annual Energy Generation
```
Annual Energy (kWh) = Roof Area × Panel Efficiency × Avg Daily Irradiance × 365
```

### Annual Cost Savings
```
Annual Savings (₹) = Annual Energy × Electricity Rate
```

### CO₂ Emission Reduction
```
CO₂ Saved (kg/year) = Annual Energy × 0.82
```
*Using 0.82 kg CO₂/kWh as India's grid emission factor*

---

## 🔌 API Endpoints

### Health Check
```
GET /api/health
```
Returns server status.

### Solar Data
```
GET /api/solar?lat={latitude}&lon={longitude}
```
Returns solar irradiance data for the specified location.

**Example:**
```
GET /api/solar?lat=28.6139&lon=77.2090
```

---

## 🗣️ Viva Defense Notes

### Why NASA POWER API?
"NASA POWER API is free, reliable, and provides scientific-grade solar irradiance data based on satellite observations. It doesn't require authentication and is widely used in solar energy research."

### Why satellite imagery?
"Satellite imagery is used for location validation and realistic visualization, while roof area is manually entered to maintain accuracy and academic simplicity."

### Why not automatic roof detection?
"Automatic roof detection would require complex computer vision/ML techniques which are beyond the scope of this educational project. Manual input ensures accuracy and keeps the project focused on solar calculations and API integration."

### Calculation Assumptions
- System losses not included (simplified for academic purposes)
- Uses average daily irradiance × 365 for annual estimate
- CO₂ factor of 0.82 kg/kWh based on Indian grid average

---

## ⚠️ Limitations

- **Educational Estimate**: Results are approximate and for educational purposes only
- **No System Losses**: Real-world systems have 10-25% losses from inverters, wiring, etc.
- **No Orientation Data**: Doesn't account for roof tilt or orientation
- **No Shading Analysis**: Doesn't consider shading from nearby objects
- **No Temperature Effects**: High temperatures can reduce panel efficiency

---

## 📝 License

This project is for educational purposes (6th Semester Major Project).

---

## 👤 Author

**Student Project** - Solar Potential Calculator

---

## 🙏 Acknowledgments

- [NASA POWER Project](https://power.larc.nasa.gov/) for solar data API
- [OpenStreetMap](https://www.openstreetmap.org/) for map tiles
- [Leaflet.js](https://leafletjs.com/) for interactive maps
- [Chart.js](https://www.chartjs.org/) for data visualization
