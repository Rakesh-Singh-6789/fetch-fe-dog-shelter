import React from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';
import { Pets, FilterAlt } from '@mui/icons-material';

interface EmptyStateProps {
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onClearFilters, onApplyFilters }) => {
  return (
    <Paper 
      elevation={1}
      sx={{ 
        py: 10, 
        textAlign: 'center', 
        bgcolor: 'rgba(91, 75, 138, 0.04)',
        borderRadius: 2,
        border: '1px solid rgba(91, 75, 138, 0.1)'
      }}
      id="no-dogs-found-container"
    >
      <Pets sx={{ fontSize: 60, color: 'primary.main', opacity: 0.5, mb: 2 }} />
      <Typography variant="h6" color="text.secondary" id="no-dogs-found-title">
        No dogs found matching your filters
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} id="no-dogs-found-subtitle">
        Try adjusting your search criteria
      </Typography>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }} id="no-dogs-found-actions">
        <Button 
          variant="outlined" 
          color="primary"
          onClick={onClearFilters}
          id="no-dogs-clear-filters-button"
        >
          Clear All Filters
        </Button>
        <Button 
          variant="contained" 
          color="secondary"
          onClick={onApplyFilters}
          startIcon={<FilterAlt />}
          id="no-dogs-apply-filters-button"
        >
          Apply Filters
        </Button>
      </Box>
    </Paper>
  );
};

export default EmptyState; 