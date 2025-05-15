import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, InputAdornment } from '@mui/material';
import { Sort } from '@mui/icons-material';
import { SortOption } from '../../types/types';

interface SortControlProps {
  sortOption: SortOption;
  onSortChange: (event: SelectChangeEvent) => void;
}

const SortControl: React.FC<SortControlProps> = ({ sortOption, onSortChange }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }} id="sort-control-container">
      <FormControl sx={{ minWidth: 200 }} size="small" id="sort-form-control">
        <InputLabel id="sort-select-label">Sort by</InputLabel>
        <Select
          labelId="sort-select-label"
          id="sort-select"
          value={`${sortOption.field}:${sortOption.direction}`}
          onChange={onSortChange}
          label="Sort by"
          startAdornment={
            <InputAdornment position="start">
              <Sort fontSize="small" />
            </InputAdornment>
          }
        >
          <MenuItem value="breed:asc" id="sort-breed-asc">Breed (A-Z)</MenuItem>
          <MenuItem value="breed:desc" id="sort-breed-desc">Breed (Z-A)</MenuItem>
          <MenuItem value="name:asc" id="sort-name-asc">Name (A-Z)</MenuItem>
          <MenuItem value="name:desc" id="sort-name-desc">Name (Z-A)</MenuItem>
          <MenuItem value="age:asc" id="sort-age-asc">Age (Youngest first)</MenuItem>
          <MenuItem value="age:desc" id="sort-age-desc">Age (Oldest first)</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default SortControl; 