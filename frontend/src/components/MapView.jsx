import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
// fix leaflet icon issue
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// component to update map center when position changes
function ChangeView({ center }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

// component to handle map clicks
function LocationMarker({ onLocationSelect }) {
    useMapEvents({
        click(e) {
            // click -> send lat/lng to parent
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

const MapView = ({ position, onLocationSelect }) => {
    // default view (India)
    const defaultCenter = [20.5937, 78.9629];
    const displayPosition = [position.lat || defaultCenter[0], position.lng || defaultCenter[1]];

    return (
        <div className="map-container card">
            <div className="card-header">
                <h2>Select Location</h2>
                <p className="subtitle">Click on map or search to pinpoint roof</p>
            </div>

            <div className="map-wrapper">
                <MapContainer
                    center={displayPosition}
                    zoom={5}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                >
                    {/* standard openstreetmap tiles */}
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* satellite view (esri) */}
                    <TileLayer
                        attribution='Tiles &copy; Esri'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        opacity={0.6} // overlay effect
                    />

                    <ChangeView center={displayPosition} />
                    <LocationMarker onLocationSelect={onLocationSelect} />

                    {/* show marker if pos exists */}
                    {position.lat && position.lng && (
                        <Marker position={[position.lat, position.lng]} />
                    )}
                </MapContainer>

                <div className="map-legend">
                    <small>Satellite view enabled for better roof visibility</small>
                </div>
            </div>
        </div>
    );
};

export default MapView;
