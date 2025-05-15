import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SortOption } from '../types/types';

interface FiltersContextType {
  // Breed filters
  selectedBreeds: string[];
  setSelectedBreeds: (breeds: string[]) => void;
  
  // Age filters
  ageMin: number | '';
  setAgeMin: (age: number | '') => void;
  ageMax: number | '';
  setAgeMax: (age: number | '') => void;
  
  // Location filters
  selectedZipCodes: string[];
  setSelectedZipCodes: (zipCodes: string[]) => void;
  
  // Sort options
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  
  // Filter modification state
  filtersModified: boolean;
  setFiltersModified: (modified: boolean) => void;
  
  // Utility functions
  clearAllFilters: () => void;
}

const FiltersContext = createContext<FiltersContextType | null>(null);

export const useFilters = () => {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error('useFilters must be used within a FiltersProvider');
  }
  return context;
};

export const FiltersProvider = ({ children }: { children: ReactNode }) => {
  // Breed filters
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  
  // Age filters
  const [ageMin, setAgeMin] = useState<number | ''>('');
  const [ageMax, setAgeMax] = useState<number | ''>('');
  
  // Location filters
  const [selectedZipCodes, setSelectedZipCodes] = useState<string[]>([]);
  
  // Sort options
  const [sortOption, setSortOption] = useState<SortOption>({ field: 'breed', direction: 'asc' });
  
  // Filter modification state
  const [filtersModified, setFiltersModified] = useState(false);
  
  // Clear all filters but preserve sort option
  const clearAllFilters = () => {
    // Clear all filter values
    setSelectedBreeds([]);
    setAgeMin('');
    setAgeMax('');
    setSelectedZipCodes([]);
    
    // Reset filter modification state
    setFiltersModified(false);
    
    // Note: We don't clear sort option as it's not a filter
    console.log('All filters cleared, preserving sort option:', sortOption);
  };
  
  const value = {
    selectedBreeds,
    setSelectedBreeds,
    ageMin,
    setAgeMin,
    ageMax,
    setAgeMax,
    selectedZipCodes,
    setSelectedZipCodes,
    sortOption,
    setSortOption,
    filtersModified,
    setFiltersModified,
    clearAllFilters
  };

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
};

export default FiltersContext; 