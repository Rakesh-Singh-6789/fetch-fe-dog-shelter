import React from 'react';
import { Paper, Typography, Box, Chip, Button } from '@mui/material';
import { FilterAlt } from '@mui/icons-material';

interface ActiveFiltersProps {
  selectedBreeds: string[];
  ageMin: number | '';
  ageMax: number | '';
  selectedZipCodes: string[];
  filtersModified: boolean;
  onRemoveBreed: (breed: string) => void;
  onClearMinAge: () => void;
  onClearMaxAge: () => void;
  onRemoveZipCode: (zipCode: string) => void;
  onClearAllFilters: () => void;
  onApplyFilters: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  selectedBreeds,
  ageMin,
  ageMax,
  selectedZipCodes,
  filtersModified,
  onRemoveBreed,
  onClearMinAge,
  onClearMaxAge,
  onRemoveZipCode,
  onClearAllFilters,
  onApplyFilters
}) => {
  const hasActiveFilters = selectedBreeds.length > 0 || ageMin !== '' || ageMax !== '' || selectedZipCodes.length > 0;
  
  if (!hasActiveFilters && !filtersModified) return null;
  
  return (
    <Paper 
      elevation={1} 
      sx={{ 
        mb: 3, 
        p: 2, 
        borderRadius: 2, 
        bgcolor: 'rgba(91, 75, 138, 0.04)',
        border: '1px solid rgba(91, 75, 138, 0.1)'
      }}
      id="active-filters-container"
    >
      <Typography variant="subtitle2" gutterBottom fontWeight="medium" color="primary" id="active-filters-title">
        Active Filters
      </Typography>
      
      {/* Breed filters */}
      {selectedBreeds.length > 0 && (
        <Box sx={{ mb: 1.5 }} id="active-breed-filters">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1, fontSize: '0.75rem' }}>
              Breed:
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }} id="active-breed-chips">
            {selectedBreeds.map((breed) => (
              <Chip 
                key={breed} 
                label={breed} 
                size="small"
                onDelete={() => onRemoveBreed(breed)}
                id={`active-breed-chip-${breed.replace(/\s+/g, '-').toLowerCase()}`}
              />
            ))}
          </Box>
        </Box>
      )}
      
      {/* Age filters */}
      {(ageMin !== '' || ageMax !== '') && (
        <Box sx={{ mb: 1.5 }} id="active-age-filters">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1, fontSize: '0.75rem' }}>
              Age:
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }} id="active-age-chips">
            {ageMin !== '' && (
              <Chip 
                label={`Min: ${ageMin} years`} 
                size="small"
                onDelete={onClearMinAge}
                id="active-min-age-chip"
              />
            )}
            {ageMax !== '' && (
              <Chip 
                label={`Max: ${ageMax} years`} 
                size="small"
                onDelete={onClearMaxAge}
                id="active-max-age-chip"
              />
            )}
          </Box>
        </Box>
      )}
      
      {/* Location filters */}
      {selectedZipCodes.length > 0 && (
        <Box sx={{ mb: 1.5 }} id="active-location-filters">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1, fontSize: '0.75rem' }}>
              Location:
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }} id="active-location-chips">
            {selectedZipCodes.map((zip) => (
              <Chip 
                key={zip} 
                label={zip} 
                size="small"
                onDelete={() => onRemoveZipCode(zip)}
                id={`active-location-chip-${zip}`}
              />
            ))}
          </Box>
        </Box>
      )}
      
      {/* Action buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }} id="active-filters-actions">
        <Button 
          size="small" 
          variant="text" 
          onClick={onClearAllFilters}
          id="active-clear-all-filters-button"
        >
          Clear All Filters
        </Button>
        {filtersModified && (
          <Button 
            size="small" 
            variant="contained" 
            color="secondary"
            onClick={onApplyFilters}
            startIcon={<FilterAlt />}
            id="active-apply-filters-button"
          >
            Apply Filters
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default ActiveFilters; 