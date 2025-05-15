import { useState, useCallback, useEffect } from 'react';
import { fetchBreeds, searchDogs, fetchDogs } from '../services/api';
import { Dog, SearchParams, SortOption } from '../types/types';

const ITEMS_PER_PAGE = 20;

interface UseDogSearchProps {
  selectedBreeds: string[];
  ageMin: number | '';
  ageMax: number | '';
  selectedZipCodes: string[];
  sortOption: SortOption;
}

interface UseDogSearchResult {
  dogs: Dog[];
  isLoading: boolean;
  error: string;
  totalPages: number;
  currentPage: number;
  availableBreeds: string[];
  setCurrentPage: (page: number) => void;
  fetchDogsList: (page: number, resetPagination?: boolean, sortOverride?: SortOption, isClearFilters?: boolean) => Promise<void>;
}

export const useDogSearch = ({
  selectedBreeds,
  ageMin,
  ageMax,
  selectedZipCodes,
  sortOption
}: UseDogSearchProps): UseDogSearchResult => {
  // Search state
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [prevCursor, setPrevCursor] = useState<string | undefined>(undefined);
  
  // Available breeds state
  const [availableBreeds, setAvailableBreeds] = useState<string[]>([]);

  // Fetch available breeds on mount
  useEffect(() => {
    const getBreeds = async () => {
      try {
        const breedsList = await fetchBreeds();
        setAvailableBreeds(breedsList.sort());
      } catch (error) {
        console.error('Error fetching breeds:', error);
        setError('Failed to load breed filters. Please try again.');
      }
    };

    getBreeds();
  }, []);

  // Fetch dogs with current search params
  const fetchDogsList = useCallback(async (
    page: number, 
    resetPagination = false, 
    sortOverride?: SortOption, 
    isClearFilters = false
  ) => {
    setIsLoading(true);
    setError('');

    try {
      // Use the override sort option if provided, otherwise use the state value
      const currentSort = sortOverride || sortOption;
      
      const params: SearchParams = {
        size: ITEMS_PER_PAGE,
        sort: `${currentSort.field}:${currentSort.direction}`
      };

      if (isClearFilters) {
        params.breeds = [];
        params.ageMin = undefined;
        params.ageMax = undefined;
        params.zipCodes = [];
        resetPagination = true;
      } else {
        if (selectedBreeds.length > 0) {
          params.breeds = [...selectedBreeds];
        }

        if (ageMin !== '') {
          params.ageMin = Number(ageMin);
        }

        if (ageMax !== '') {
          params.ageMax = Number(ageMax);
        }

        // Add zip codes filter if available
        if (selectedZipCodes.length > 0) {
          params.zipCodes = [...selectedZipCodes];
        }

        // Handle pagination based on cursor
        if (!resetPagination) {
          if (page > currentPage && nextCursor) {
            params.from = nextCursor;
          } else if (page < currentPage && prevCursor) {
            params.from = prevCursor;
          }
        }
      }

      const searchResponse = await searchDogs(params);
      
      if (searchResponse.resultIds.length > 0) {
        const dogsData = await fetchDogs(searchResponse.resultIds);
        setDogs(dogsData);
        setTotalPages(Math.ceil(searchResponse.total / ITEMS_PER_PAGE));
        
        // Extract cursor values from the "next" and "prev" URLs
        const extractFromParam = (url?: string) => {
          if (!url) return undefined;
          
          // The URL could be a full URL or just query parameters
          const fromMatch = url.match(/from=([^&]+)/);
          return fromMatch ? fromMatch[1] : undefined;
        };
        
        setNextCursor(extractFromParam(searchResponse.next));
        setPrevCursor(extractFromParam(searchResponse.prev));
      } else {
        setDogs([]);
        setTotalPages(1);
        setNextCursor(undefined);
        setPrevCursor(undefined);
      }
    } catch (error) {
      console.error('Error fetching dogs:', error);
      setError('Failed to load dogs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, nextCursor, prevCursor, selectedBreeds, ageMin, ageMax, selectedZipCodes, sortOption]);

  // Initial fetch on mount
  useEffect(() => {
    fetchDogsList(1, true);
  }, []);

  return {
    dogs,
    isLoading,
    error,
    totalPages,
    currentPage,
    availableBreeds,
    setCurrentPage,
    fetchDogsList
  };
};

export default useDogSearch; 