# ☀️ Solar Potential Calculator

A web-based application that estimates rooftop solar energy potential using real-time NASA solar data and interactive maps.

**6th Semester NON-CRT Major Project**

---

## 🎯 Project Overview

This application helps users estimate how much solar energy their rooftop can generate. It combines:

- **User-provided roof area** - You tell us how big your roof is
- **Real-time solar data from NASA** - We fetch actual sunlight data for your location
- **Interactive map** - Click anywhere to select your location
- **Cost savings calculation** - See how much money you can save

### What It Calculates

| Output | Description |
|--------|-------------|
| ⚡ Annual Energy | How many kWh of electricity your solar panels can generate |
| 💰 Annual Savings | How much money you'll save on electricity bills (in ₹) |
| 🌱 CO₂ Reduction | Your contribution to reducing carbon emissions (in kg) |

---

## 🛠️ Tech Stack

### Frontend (React)
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and development server
- **Leaflet.js** - Interactive maps with OpenStreetMap
- **Chart.js** - Beautiful data visualizations
- **CSS3** - Responsive, modern design

### Backend (Node.js)
- **Node.js** - JavaScript runtime
- **Express.js** - Web server framework
- **node-cache** - Caching API responses for better performance

### External APIs
- **NASA POWER API** - Provides real solar irradiance data based on satellite measurements
- **OpenStreetMap** - Free map tiles
- **ESRI World Imagery** - Satellite view
- **Nominatim** - Location search (geocoding)

---

## 📁 Project Structure

```
SolarSavingsCalculator/
├── backend/
│   ├── server.js           # Express server - handles API requests
│   ├── solarApiService.js  # Fetches data from NASA POWER API
│   ├── cacheService.js     # Caches responses to reduce API calls
│   └── package.json        # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Header.jsx          # Top banner with logo
│   │   │   ├── MapView.jsx         # Interactive Leaflet map
│   │   │   ├── LocationSearch.jsx  # Search for places
│   │   │   ├── CalculatorForm.jsx  # Input form
│   │   │   ├── ResultsSection.jsx  # Displays results
│   │   │   ├── ResultCard.jsx      # Individual result card
│   │   │   ├── MonthlyChart.jsx    # Bar chart for monthly data
│   │   │   └── ErrorMessage.jsx    # Error display
│   │   │
│   │   ├── services/       # Business logic
│   │   │   ├── apiService.js       # API calls to backend
│   │   │   └── calculationService.js # Solar energy formulas
│   │   │
│   │   ├── utils/
│   │   │   └── constants.js        # Shared constants
│   │   │
│   │   ├── App.jsx         # Main component
│   │   ├── App.css         # Styles
│   │   └── main.jsx        # Entry point
│   │
│   ├── index.html          # HTML template
│   ├── vite.config.js      # Vite configuration
│   └── package.json        # Frontend dependencies
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/abhi9vaidya/SolarSavingsCalculator.git
cd SolarSavingsCalculator
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

### Running the Application

#### Option 1: Development Mode (Recommended for testing)

Start the backend server:
```bash
cd backend
npm start
```

In a new terminal, start the React dev server:
```bash
cd frontend
npm run dev
```

Open: **http://localhost:5173**

#### Option 2: Production Mode

Build the frontend:
```bash
cd frontend
npm run build
```

Start the backend (serves the built frontend):
```bash
cd backend
npm start
```

Open: **http://localhost:3000**

---

## 📖 How to Use

### Step 1: Select Your Location
- **Click on the map** to drop a pin at your location, OR
- **Search** for your city/address using the search box, OR
- **Enter coordinates** manually

### Step 2: Switch to Satellite View (Optional)
- Click "Satellite View" to see actual rooftops
- Helps you verify you've selected the right location

### Step 3: Enter Your Details
| Field | Description |
|-------|-------------|
| Roof Area | Your usable roof area in square meters (m²) |
| Panel Type | Select efficiency: 16% (basic) to 22% (premium) |
| Electricity Rate | Your current electricity cost per unit (₹/kWh) |

### Step 4: Calculate
- Click **"Calculate Solar Potential"**
- View your results with animated counters
- Check the monthly chart to see seasonal variations

---

## 🧮 How the Calculations Work

### Annual Energy Generation
```
Annual Energy (kWh) = Roof Area × Panel Efficiency × Daily Sunlight × 365 days
```
**Example:** 50 m² roof × 18% efficiency × 5 kWh/m²/day × 365 = **16,425 kWh/year**

### Annual Cost Savings
```
Annual Savings (₹) = Annual Energy × Electricity Rate
```
**Example:** 16,425 kWh × ₹8/kWh = **₹1,31,400/year**

### CO₂ Emission Reduction
```
CO₂ Saved (kg) = Annual Energy × 0.82
```
**Example:** 16,425 kWh × 0.82 = **13,469 kg CO₂/year**

> The 0.82 factor is based on India's average grid emission factor

---

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Check if server is running |
| `/api/solar?lat=28.6&lon=77.2` | GET | Get solar data for coordinates |

### Example Response
```json
{
  "success": true,
  "data": {
    "averageDailyIrradiance": 5.23,
    "monthlyData": [...]
  },
  "location": {
    "latitude": 28.6,
    "longitude": 77.2
  }
}
```

---

## 🗣️ Viva Questions & Answers

### Q: Why did you choose React?
> "React is a modern, component-based framework that makes it easy to build interactive UIs. It's widely used in the industry and has great documentation for learning."

### Q: Why NASA POWER API?
> "NASA POWER API provides free, reliable, scientific-grade solar irradiance data based on satellite observations. It doesn't require authentication and is trusted for solar energy research."

### Q: Why not detect roof area automatically?
> "Automatic roof detection would require computer vision and machine learning, which is beyond the scope of this project. Manual input keeps the focus on solar calculations and API integration."

### Q: What are the limitations?
> "This is an educational estimate. Real-world factors like panel orientation, shading, system losses (10-25%), and temperature effects aren't included."

### Q: How accurate is it?
> "The solar irradiance data from NASA is accurate. The calculation gives a theoretical maximum. Real installations typically achieve 75-90% of this estimate."

---

## ⚠️ Limitations

| Limitation | Impact |
|------------|--------|
| No system losses | Real systems lose 10-25% to inverters, wiring |
| No orientation data | Assumes optimal roof tilt/direction |
| No shading analysis | Doesn't consider trees, buildings |
| No temperature effects | High heat reduces efficiency |

> **Note:** This is an educational tool. For actual solar installation, consult a professional.

---

## 🧑‍� Authors

**Jiya Divyanshi Pandita** & **Abhinav Vaidya**

6th Semester, Computer Science Engineering

---

## 🙏 Acknowledgments

- [NASA POWER Project](https://power.larc.nasa.gov/) - Solar irradiance data
- [OpenStreetMap](https://www.openstreetmap.org/) - Map tiles
- [Leaflet.js](https://leafletjs.com/) - Interactive maps
- [Chart.js](https://www.chartjs.org/) - Data visualization
- [React](https://react.dev/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool

---

## 📄 License

This project is created for educational purposes (6th Semester NON-CRT Project).
