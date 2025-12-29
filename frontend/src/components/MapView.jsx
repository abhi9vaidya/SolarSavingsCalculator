// ====================================
// Map View Component
// ====================================
// This shows an interactive map where users can click to select their location
// Uses Leaflet library with OpenStreetMap and satellite imagery

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DEFAULT_LOCATION } from '../utils/constants';

// Fix for default marker icon (Leaflet + React issue)
// This ensures the location pin shows up correctly
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon (emoji pin)
const customIcon = L.divIcon({
    html: '<div style="font-size: 32px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">📍</div>',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    className: 'custom-marker'
});

/**
 * Map Click Handler Component
 * This invisible component listens for clicks on the map
 * When you click, it updates the marker position
 */
function MapClickHandler({ onLocationSelect }) {
    useMapEvents({
        click: (e) => {
            // Get the coordinates where the user clicked
            const { lat, lng } = e.latlng;
            // Tell the parent component about the new location
            onLocationSelect(lat, lng);
        }
    });
    return null; // This component doesn't render anything visible
}

function MapView({ position, onLocationSelect }) {
    // State to track which map view is active (street or satellite)
    const [isSatelliteView, setIsSatelliteView] = useState(false);

    // Toggle between street view and satellite view
    const toggleSatelliteView = () => {
        setIsSatelliteView(!isSatelliteView);
    };

    return (
        <div className="card map-section">
            <h2 className="card-title">Select Location</h2>

            {/* Button to switch between map views */}
            <div className="map-controls">
                <button
                    type="button"
                    onClick={toggleSatelliteView}
                    className={`btn-secondary ${isSatelliteView ? 'active' : ''}`}
                >
                    {isSatelliteView ? 'Street View' : 'Satellite View'}
                </button>
            </div>

            {/* The actual map */}
            <div className="map-container">
                <MapContainer
                    center={[position.lat, position.lng]}
                    zoom={DEFAULT_LOCATION.zoom}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                >
                    {/* Map tiles - either street view or satellite view */}
                    {isSatelliteView ? (
                        // Satellite imagery from ESRI (free alternative to Mapbox)
                        <TileLayer
                            attribution='Tiles &copy; Esri'
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            maxZoom={19}
                        />
                    ) : (
                        // Street map from OpenStreetMap (free and open source)
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            maxZoom={19}
                        />
                    )}

                    {/* The pin showing selected location */}
                    {position.lat && position.lng && (
                        <Marker
                            position={[position.lat, position.lng]}
                            icon={customIcon}
                        />
                    )}

                    {/* Invisible component that handles map clicks */}
                    <MapClickHandler onLocationSelect={onLocationSelect} />
                </MapContainer>
            </div>

            {/* Helpful hint for users */}
            <p className="map-hint">
                <strong>Tip:</strong> Click on the map to select your location.
                Use satellite view to verify your roof location.
            </p>
        </div>
    );
}

export default MapView;
