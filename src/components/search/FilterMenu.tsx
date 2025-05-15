import React from 'react';
import { 
  Popover, Typography, FormControl, InputLabel, Select, 
  MenuItem, OutlinedInput, Box, Chip, TextField, Button, 
  Divider, SelectChangeEvent, InputAdornment
} from '@mui/material';
import { Place, FilterAlt } from '@mui/icons-material';

interface FilterMenuProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  selectedBreeds: string[];
  availableBreeds: string[];
  ageMin: number | '';
  ageMax: number | '';
  selectedZipCodes: string[];
  onBreedSelect: (event: SelectChangeEvent<string[]>) => void;
  onMinAgeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMaxAgeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearLocationFilter: () => void;
  onNavigateToLocationSearch: () => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

const FilterMenu: React.FC<FilterMenuProps> = ({
  open,
  anchorEl,
  onClose,
  selectedBreeds,
  availableBreeds,
  ageMin,
  ageMax,
  selectedZipCodes,
  onBreedSelect,
  onMinAgeChange,
  onMaxAgeChange,
  onClearLocationFilter,
  onNavigateToLocationSearch,
  onClearFilters,
  onApplyFilters
}) => {
  return (
    <Popover
      id="filter-menu"
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      PaperProps={{
        sx: { 
          width: 320,
          p: 3,
          boxShadow: '0px 8px 24px rgba(0,0,0,0.15)',
          borderRadius: 2,
        }
      }}
    >
      <Typography variant="h6" gutterBottom id="filter-menu-title">
        Filter Dogs
      </Typography>
      
      {/* Breed filters */}
      <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, color: 'primary.main', fontWeight: 500 }} id="breed-filters-title">
        Breed Filters
      </Typography>
      <FormControl fullWidth size="small" sx={{ mb: 3 }} id="breed-select-form">
        <InputLabel id="breed-select-label">Select Breeds</InputLabel>
        <Select
          labelId="breed-select-label"
          id="breed-select"
          multiple
          value={selectedBreeds}
          onChange={onBreedSelect}
          input={<OutlinedInput label="Select Breeds" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }} id="selected-breeds-container">
              {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
            </Box>
          )}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300,
              },
            },
          }}
        >
          {availableBreeds.map((breed) => (
            <MenuItem key={breed} value={breed}>
              {breed}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      {/* Age filters */}
      <Typography variant="subtitle2" gutterBottom sx={{ color: 'primary.main', fontWeight: 500 }} id="age-filters-title">
        Age Filters
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }} id="age-filters-container">
        <TextField
          label="Min Age"
          type="number"
          size="small"
          fullWidth
          value={ageMin}
          onChange={onMinAgeChange}
          InputProps={{ 
            inputProps: { min: 0 },
            startAdornment: <InputAdornment position="start"></InputAdornment>
          }}
          id="min-age-input"
        />
        <TextField
          label="Max Age"
          type="number"
          size="small"
          fullWidth
          value={ageMax}
          onChange={onMaxAgeChange}
          InputProps={{ 
            inputProps: { min: ageMin === '' ? 0 : ageMin },
            startAdornment: <InputAdornment position="start"></InputAdornment>
          }}
          id="max-age-input"
        />
      </Box>
      
      {/* Location filter section */}
      <Typography variant="subtitle2" gutterBottom sx={{ color: 'primary.main', fontWeight: 500 }} id="location-filters-title">
        Location Filters
      </Typography>
      {selectedZipCodes.length > 0 ? (
        <Box sx={{ mb: 3 }} id="selected-locations-container">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }} id="selected-zipcodes-chips">
            {selectedZipCodes.map((zip) => (
              <Chip 
                key={zip} 
                label={zip} 
                size="small"
                onDelete={() => {
                  const newZips = selectedZipCodes.filter(z => z !== zip);
                  // We don't directly modify the zipCodes here as that would be handled by the parent component
                }}
                id={`zipcode-chip-${zip}`}
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Place />}
              onClick={() => {
                onClose();
                onNavigateToLocationSearch();
              }}
              id="edit-locations-button"
            >
              Edit
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={onClearLocationFilter}
              id="clear-locations-button"
            >
              Clear All
            </Button>
          </Box>
        </Box>
      ) : (
        <Button
          variant="outlined"
          startIcon={<Place />}
          onClick={() => {
            onClose();
            onNavigateToLocationSearch();
          }}
          sx={{ mb: 3 }}
          fullWidth
          size="small"
          id="add-location-filter-button"
        >
          Add Location Filter
        </Button>
      )}
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button
          variant="text"
          onClick={onClearFilters}
          size="small"
          id="clear-filters-button"
        >
          Clear Filters
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={onApplyFilters}
          startIcon={<FilterAlt />}
          id="apply-filters-button"
        >
          Apply Filters
        </Button>
      </Box>
    </Popover>
  );
};

export default FilterMenu; 