import axios from 'axios';
import { Dog, Location, Match, SearchParams, SearchResponse, LocationSearchParams, LocationSearchResponse } from '../types/types';

const BASE_URL = 'https://frontend-take-home-service.fetch.com';

// Configure axios to include credentials with all requests
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // This enables sending cookies with requests
  headers: {
    'Referrer-Policy': 'no-referrer'
  }
});

// Add response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If 401 or 403, the token might be expired : 1 hour 
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Redirect to login page if not already there
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// Authentication
export const login = async (name: string, email: string): Promise<void> => {
  await api.post('/auth/login', { name, email });
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

// Dogs
export const fetchBreeds = async (): Promise<string[]> => {
  const response = await api.get<string[]>('/dogs/breeds');
  return response.data;
};

export const searchDogs = async (params: SearchParams): Promise<SearchResponse> => {
  // Create a new URLSearchParams object for proper array handling
  const searchParams = new URLSearchParams();
  
  // Add size parameter
  if (params.size) {
    searchParams.append('size', params.size.toString());
  }
  
  // Add sort parameter
  if (params.sort) {
    searchParams.append('sort', params.sort);
  }
  
  // Add from parameter (for pagination)
  if (params.from) {
    searchParams.append('from', params.from);
  }
  
  // Add age parameters
  if (params.ageMin !== undefined) {
    searchParams.append('ageMin', params.ageMin.toString());
  }
  
  if (params.ageMax !== undefined) {
    searchParams.append('ageMax', params.ageMax.toString());
  }
  
  // Add breeds as multiple entries with the same key
  if (params.breeds && params.breeds.length > 0) {
    // Ensure each breed is added as a separate parameter with the same key
    params.breeds.forEach(breed => {
      searchParams.append('breeds', breed);
    });
  }
  
  // Add zipCodes as multiple entries with the same key
  if (params.zipCodes && params.zipCodes.length > 0) {
    // Ensure each zipCode is added as a separate parameter with the same key
    params.zipCodes.forEach(zipCode => {
      searchParams.append('zipCodes', zipCode);
    });
  }
  
  // Log the query string for debugging
  console.log('Search query:', searchParams.toString());
  
  // Make the request with the properly formatted query string
  const response = await api.get<SearchResponse>(`/dogs/search?${searchParams.toString()}`);
  return response.data;
};

export const fetchDogs = async (dogIds: string[]): Promise<Dog[]> => {
  const response = await api.post<Dog[]>('/dogs', dogIds);
  return response.data;
};

export const findMatch = async (dogIds: string[]): Promise<Match> => {
  const response = await api.post<Match>('/dogs/match', dogIds);
  return response.data;
};

// Locations
export const fetchLocations = async (zipCodes: string[]): Promise<Location[]> => {
  const response = await api.post<Location[]>('/locations', zipCodes);
  return response.data;
};

export const searchLocations = async (params: LocationSearchParams): Promise<LocationSearchResponse> => {
  const response = await api.post<LocationSearchResponse>('/locations/search', params);
  return response.data;
};

// images not fetching because of different domain
export const transformDogImageUrl = (imgUrl: string): string => {
  return imgUrl;
};

export default api; 