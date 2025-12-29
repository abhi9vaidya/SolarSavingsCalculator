// ====================================
// Location Search Component
// ====================================
// This lets users search for a place by name (e.g., "Mumbai", "New Delhi")
// It converts the place name to coordinates using OpenStreetMap

import React, { useState } from 'react';

function LocationSearch({ onLocationFound, onError }) {
    // State to store what the user is typing
    const [searchQuery, setSearchQuery] = useState('');
    // State to show loading spinner while searching
    const [isSearching, setIsSearching] = useState(false);

    /**
     * Handle the search when user clicks the button or presses Enter
     */
    const handleSearch = async () => {
        // Don't search if the input is empty
        if (!searchQuery.trim()) return;

        try {
            setIsSearching(true); // Show loading state

            // Call the Nominatim API to find the location
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`
            );
            const data = await response.json();

            // Check if we found any results
            if (data.length > 0) {
                const { lat, lon, display_name } = data[0];

                // Tell the parent component we found a location
                onLocationFound({
                    lat: parseFloat(lat),
                    lng: parseFloat(lon),
                    name: display_name.split(',').slice(0, 3).join(',') // Shortened name
                });

                // Update the search box with the found location name
                setSearchQuery(display_name.split(',').slice(0, 3).join(','));
            } else {
                // No results found
                onError('Location not found. Try a different search term.');
            }
        } catch (error) {
            // Something went wrong with the search
            console.error('Location search failed:', error);
            onError('Failed to search location. Please try again.');
        } finally {
            setIsSearching(false); // Hide loading state
        }
    };

    /**
     * Handle Enter key press in the search box
     */
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    return (
        <div className="form-group">
            <label htmlFor="locationSearch">Search Location</label>

            <div className="search-input-wrapper">
                {/* Search input box */}
                <input
                    type="text"
                    id="locationSearch"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter city name or address..."
                    autoComplete="off"
                    disabled={isSearching}
                />

                {/* Search button */}
                <button
                    type="button"
                    onClick={handleSearch}
                    className="btn-icon"
                    title="Search location"
                    disabled={isSearching}
                >
                    {isSearching ? 'Searching...' : 'Search'}
                </button>
            </div>

            {/* Helpful hint */}
            <small className="hint">Or click on the map to select location</small>
        </div>
    );
}

export default LocationSearch;
