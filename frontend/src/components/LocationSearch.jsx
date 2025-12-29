import React, { useState } from 'react';
import { searchLocation } from '../services/apiService';

const LocationSearch = ({ onLocationFound }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // user typing...
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        // call api to find places
        const foundLocations = await searchLocation(query);
        setResults(foundLocations);
        setIsSearching(false);
    };

    // user clicked a suggestion
    const selectLocation = (loc) => {
        onLocationFound({
            lat: parseFloat(loc.lat),
            lng: parseFloat(loc.lon),
            name: loc.display_name
        });
        setResults([]); // clear dropdown
        setQuery(loc.display_name); // show picked name
    };

    return (
        <div className="location-search">
            <div className="search-box">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter city (e.g. Mumbai)"
                />
                <button onClick={handleSearch} disabled={isSearching}>
                    {isSearching ? '...' : 'Search'}
                </button>
            </div>

            {/* dropdown list */}
            {results.length > 0 && (
                <ul className="search-results">
                    {results.map((loc) => (
                        <li key={loc.place_id} onClick={() => selectLocation(loc)}>
                            {loc.display_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LocationSearch;
