import React from 'react';
import { Alert, Button } from '@mui/material';
import { FilterAlt } from '@mui/icons-material';

interface SearchNotificationsProps {
  error: string;
  filtersModified: boolean;
  onClearError: () => void;
  onApplyFilters: () => void;
}

const SearchNotifications: React.FC<SearchNotificationsProps> = ({
  error,
  filtersModified,
  onClearError,
  onApplyFilters
}) => {
  return (
    <>
      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={onClearError}
          id="error-alert"
        >
          {error}
        </Alert>
      )}

      {/* Filter notification when filters are modified */}
      {filtersModified && (
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={onApplyFilters}
              startIcon={<FilterAlt />}
              id="notification-apply-button"
            >
              Apply Now
            </Button>
          }
          id="filters-modified-notification"
        >
          You have modified filters. Click "Apply Filters" to see results.
        </Alert>
      )}
    </>
  );
};

export default SearchNotifications; 