import React, { useEffect, useMemo, memo } from 'react';
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
        if (center) {
            // Check if center is roughly the default (India)
            const isDefault = Math.abs(center[0] - 20.5937) < 0.1 && Math.abs(center[1] - 78.9629) < 0.1;
            const targetZoom = isDefault ? 5 : 12;

            map.flyTo(center, targetZoom, {
                animate: true,
                duration: 1.5
            });
        }
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

function MapView({ position, onLocationSelect }) {
    // default view (India)
    const defaultCenter = [20.5937, 78.9629];

    // MEMOIZE: Only create new array if lat/lng changes
    const displayPosition = useMemo(() =>
        [position.lat || defaultCenter[0], position.lng || defaultCenter[1]],
        [position.lat, position.lng]
    );

    const [isSatelliteView, setIsSatelliteView] = React.useState(false);

    return (
        <div className={`map-container card ${isSatelliteView ? 'satellite-active' : ''}`}>
            <div className="card-header">
                <h2>Select Location</h2>
                <p className="subtitle">Click on map or search to pinpoint roof</p>
            </div>

            <div className="map-wrapper">
                <div className="map-controls">
                    <button
                        type="button"
                        className={`btn-secondary ${isSatelliteView ? 'active' : ''}`}
                        onClick={() => setIsSatelliteView(!isSatelliteView)}
                    >
                        {isSatelliteView ? 'Street View' : 'Satellite View'}
                    </button>
                </div>
                <MapContainer
                    center={displayPosition}
                    zoom={5}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                >
                    {/* standard openstreetmap tiles */}
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* satellite view (esri) */}
                    {isSatelliteView && (
                        <TileLayer
                            attribution='Tiles &copy; Esri'
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        />
                    )}

                    <ChangeView center={displayPosition} />
                    <LocationMarker onLocationSelect={onLocationSelect} />

                    {/* show marker if pos exists */}
                    {position.lat && position.lng && (
                        <Marker position={[position.lat, position.lng]} />
                    )}
                </MapContainer>

            </div>
        </div>
    );
};

export default memo(MapView);
