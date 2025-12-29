import React, { useState, useEffect, useRef } from 'react';
import { searchLocation } from '../services/apiService';

const LocationSearch = ({ onLocationFound,
    searchQuery,
    setSearchQuery,
    currentLat,
    currentLng
}) => {
    const [inputValue, setInputValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const debounceTimeout = useRef(null);

    // Sync local input when external searchQuery changes (e.g. from Map click)
    useEffect(() => {
        if (searchQuery !== inputValue) {
            setInputValue(searchQuery || '');
        }
    }, [searchQuery]);

    // Handle typing: update local state + standard debounced search (suggestions)
    const handleInputChange = (e) => {
        const val = e.target.value;
        setInputValue(val);

        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        if (!val.trim()) {
            return;
        }

        debounceTimeout.current = setTimeout(async () => {
            setIsSearching(true);
            try {
                const foundLocations = await searchLocation(val);
                if (foundLocations && foundLocations.length > 0) {
                    const loc = foundLocations[0];
                    onLocationFound({
                        lat: parseFloat(loc.lat),
                        lng: parseFloat(loc.lon),
                        name: val
                    });
                    setSearchQuery(val);
                }
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                setIsSearching(false);
            }
        }, 800); // 800ms delay for smoother experience
    };

    // Explicit Search (Enter key or Button)
    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!inputValue.trim()) return;

        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        setIsSearching(true);
        try {
            const foundLocations = await searchLocation(inputValue);
            if (foundLocations && foundLocations.length > 0) {
                const loc = foundLocations[0];
                onLocationFound({
                    lat: parseFloat(loc.lat),
                    lng: parseFloat(loc.lon),
                    name: inputValue
                });
                setSearchQuery(inputValue);
            }
        } catch (err) {
            console.error("Manual search failed", err);
        } finally {
            setIsSearching(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    return (
        <div className="location-search">
            <div className="search-box-pill">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Search city (e.g. Nagpur)..."
                    autoComplete="off"
                />
                <button className="search-btn-icon" onClick={handleSearch} disabled={isSearching} title="Search Location">
                    {isSearching ? (
                        <span className="spinner-small"></span>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    )}
                </button>
            </div>
            {currentLat && currentLng && !isSearching && (
                <div className="coordinates-tag">
                    <span className="coord-label">📍 {currentLat}, {currentLng}</span>
                </div>
            )}
        </div>
    );
};

export default LocationSearch;
