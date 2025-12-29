import axios from 'axios';
import { API_BASE_URL, NOMINATIM_BASE_URL } from '../utils/constants';

// get solar data from our backend
export const fetchSolarData = async (lat, lon) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/solar`, {
            params: { lat, lon }
        });
        return response.data;
    } catch (error) {
        // throw simplified error
        throw new Error(error.response?.data?.message || 'Failed to fetch solar data');
    }
};

// search place name (openstreetmap api)
export const searchLocation = async (query) => {
    try {
        const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
            params: {
                q: query,
                format: 'json',
                limit: 5 // max 5 results
            }
        });
        return response.data;
    } catch (error) {
        console.error('search failed', error);
        return [];
    }
};

// get address from coords
export const reverseGeocode = async (lat, lon) => {
    try {
        const response = await axios.get(`${NOMINATIM_BASE_URL}/reverse`, {
            params: {
                lat,
                lon,
                format: 'json'
            }
        });
        return response.data.display_name;
    } catch (error) {
        return null;
    }
};
