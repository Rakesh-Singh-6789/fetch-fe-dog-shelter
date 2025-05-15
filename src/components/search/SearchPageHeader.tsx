import React from 'react';
import { Grid, Typography, Box, Button, Badge } from '@mui/material';
import { FilterAlt, Favorite } from '@mui/icons-material';

interface SearchPageHeaderProps {
  onFilterClick: (event: React.MouseEvent<HTMLElement>) => void;
  onOpenFavorites: () => void;
  favoritesCount: number;
  hasActiveFilters: boolean;
  filterCount: number;
}

const SearchPageHeader: React.FC<SearchPageHeaderProps> = ({
  onFilterClick,
  onOpenFavorites,
  favoritesCount,
  hasActiveFilters,
  filterCount
}) => {
  return (
    <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
      <Grid item xs={12} md={6}>
        <Typography variant="h5" component="h1" gutterBottom>
          Find Your Perfect Dog
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Browse our available dogs and filter by breed, age, and location
        </Typography>
      </Grid>
      <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterAlt />}
            onClick={onFilterClick}
            aria-controls="filter-menu"
            aria-haspopup="true"
            aria-expanded="false"
            id="filter-button"
          >
            Filters
            {hasActiveFilters && (
              <Box
                component="span"
                sx={{
                  ml: 1,
                  bgcolor: 'primary.main',
                  color: 'white',
                  borderRadius: '50%',
                  width: 20,
                  height: 20,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                }}
                id="filter-count-badge"
              >
                {filterCount}
              </Box>
            )}
          </Button>
          <Badge 
            badgeContent={favoritesCount} 
            color="secondary"
            max={99}
            overlap="circular"
            id="favorites-badge"
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<Favorite />}
              onClick={onOpenFavorites}
              id="favorites-button"
            >
              Favorites & Match
            </Button>
          </Badge>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SearchPageHeader; 