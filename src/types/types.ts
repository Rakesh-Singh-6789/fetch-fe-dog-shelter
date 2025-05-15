export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export interface Location {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface User {
  name: string;
  email: string;
}

export interface SearchResponse {
  resultIds: string[];
  total: number;
  next?: string;
  prev?: string;
}

export interface SearchParams {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: string;
  sort?: string;
}

export interface LocationSearchParams {
  city?: string;
  states?: string[];
  geoBoundingBox?: {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
    bottom_left?: Coordinates;
    top_right?: Coordinates;
  };
  size?: number;
  from?: string;
}

export interface Match {
  match: string;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

export interface LocationSearchResponse {
  results: Location[];
  total: number;
  next?: string;
  prev?: string;
} 