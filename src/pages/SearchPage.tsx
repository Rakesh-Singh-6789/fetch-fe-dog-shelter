import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Pagination, Zoom, Fab, SelectChangeEvent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { KeyboardArrowUp } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useFilters } from '../context/FiltersContext';
import { Dog, SortOption } from '../types/types';
import DogCard from '../components/DogCard';
import DogDetailsModal from '../components/modals/DogDetailsModal';
import FavoritesSidebar from '../components/FavoritesSidebar';

// Import modularized components
import DogCardSkeleton from '../components/ui/DogCardSkeleton';
import EmptyState from '../components/ui/EmptyState';
import SortControl from '../components/search/SortControl';
import SearchPageHeader from '../components/search/SearchPageHeader';
import SearchNotifications from '../components/search/SearchNotifications';
import ActiveFilters from '../components/search/ActiveFilters';
import FilterMenu from '../components/search/FilterMenu';

// Import custom hook for search functionality
import useDogSearch from '../hooks/useDogSearch';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { favorites } = useFavorites();
  const { 
    selectedBreeds, setSelectedBreeds,
    ageMin, setAgeMin,
    ageMax, setAgeMax,
    selectedZipCodes, setSelectedZipCodes,
    sortOption, setSortOption,
    filtersModified, setFiltersModified,
    clearAllFilters
  } = useFilters();
  
  // UI state
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const filterMenuOpen = Boolean(filterAnchorEl);
  const [favoritesDrawerOpen, setFavoritesDrawerOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // Dog details modal state
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [dogDetailsModalOpen, setDogDetailsModalOpen] = useState(false);

  // Use custom hook for dog search functionality
  const {
    dogs,
    isLoading,
    error,
    totalPages,
    currentPage,
    availableBreeds,
    setCurrentPage,
    fetchDogsList
  } = useDogSearch({
    selectedBreeds,
    ageMin,
    ageMax,
    selectedZipCodes,
    sortOption
  });

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      fetchDogsList(page, false);
    }
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    const [field, direction] = value.split(':');
    const newSortOption: SortOption = { 
      field, 
      direction: direction as 'asc' | 'desc' 
    };
    
    // Update sort option in context
    setSortOption(newSortOption);
    setCurrentPage(1);
    // Apply sort immediately 
    fetchDogsList(1, true, newSortOption);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleApplyFilters = () => {
    // Close the filter menu
    handleFilterClose();
    setFiltersModified(false);
    
    // Reset to the first page and fetch dogs with all current filters
    setCurrentPage(1);
    fetchDogsList(1, true);
  };

  const handleClearFilters = () => {
    // Clear all filters but don't close the filter menu
    clearAllFilters();
    setCurrentPage(1);
    fetchDogsList(1, true, undefined, true);
  };

  const handleBreedSelect = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedBreeds(typeof value === 'string' ? value.split(',') : value);
    setFiltersModified(true);
  };
  
  const handleMinAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgeMin(e.target.value === '' ? '' : Number(e.target.value));
    setFiltersModified(true);
  };

  const handleMaxAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgeMax(e.target.value === '' ? '' : Number(e.target.value));
    setFiltersModified(true);
  };

  const handleClearMinAge = () => {
    setAgeMin('');
    setFiltersModified(true);
  };

  const handleClearMaxAge = () => {
    setAgeMax('');
    setFiltersModified(true);
  };
  
  const handleRemoveBreed = (breed: string) => {
    const updatedBreeds = selectedBreeds.filter(b => b !== breed);
    setSelectedBreeds(updatedBreeds);
    setFiltersModified(true);
  };

  const handleRemoveZipCode = (zipCode: string) => {
    const newZips = selectedZipCodes.filter(z => z !== zipCode);
    setSelectedZipCodes(newZips);
    setFiltersModified(true);
  };

  const handleClearLocationFilter = () => {
    setSelectedZipCodes([]);
    setFiltersModified(true);
  };

  const handleNavigateToLocationSearch = () => {
    navigate('/locations');
  };
  
  // Handle clearing all filters
  const handleClearAllFilters = () => {
    clearAllFilters();
    setCurrentPage(1);
    fetchDogsList(1, true, undefined, true);
  };

  const handleViewDogDetails = (dog: Dog) => {
    setSelectedDog(dog);
    setDogDetailsModalOpen(true);
  };

  const handleClearError = () => {
    // Add this handler to clear errors
    // In our case, we need to handle this within the useDogSearch hook
  };

  return (
    <Box sx={{ minHeight: '100vh', pb: 6, bgcolor: 'background.default' }}>
      <Container sx={{ pt: 4 }}>
        {/* Search Header with Filter and Favorites buttons */}
        <SearchPageHeader
          onFilterClick={handleFilterClick}
          onOpenFavorites={() => setFavoritesDrawerOpen(true)}
          favoritesCount={favorites.length}
          hasActiveFilters={selectedBreeds.length > 0 || ageMin !== '' || ageMax !== '' || selectedZipCodes.length > 0}
          filterCount={selectedBreeds.length + (ageMin !== '' ? 1 : 0) + (ageMax !== '' ? 1 : 0) + (selectedZipCodes.length > 0 ? 1 : 0)}
        />

        {/* Filter Menu */}
        <FilterMenu 
          open={filterMenuOpen}
          anchorEl={filterAnchorEl}
          onClose={handleFilterClose}
          selectedBreeds={selectedBreeds}
          availableBreeds={availableBreeds}
          ageMin={ageMin}
          ageMax={ageMax}
          selectedZipCodes={selectedZipCodes}
          onBreedSelect={handleBreedSelect}
          onMinAgeChange={handleMinAgeChange}
          onMaxAgeChange={handleMaxAgeChange}
          onClearLocationFilter={handleClearLocationFilter}
          onNavigateToLocationSearch={handleNavigateToLocationSearch}
          onClearFilters={handleClearFilters}
          onApplyFilters={handleApplyFilters}
        />

        {/* Active Filters */}
        <ActiveFilters
          selectedBreeds={selectedBreeds}
          ageMin={ageMin}
          ageMax={ageMax}
          selectedZipCodes={selectedZipCodes}
          filtersModified={filtersModified}
          onRemoveBreed={handleRemoveBreed}
          onClearMinAge={handleClearMinAge}
          onClearMaxAge={handleClearMaxAge}
          onRemoveZipCode={handleRemoveZipCode}
          onClearAllFilters={handleClearAllFilters}
          onApplyFilters={handleApplyFilters}
        />

        {/* Sort Control */}
        <SortControl 
          sortOption={sortOption}
          onSortChange={handleSortChange}
        />

        {/* Notifications */}
        <SearchNotifications
          error={error}
          filtersModified={filtersModified}
          onClearError={handleClearError}
          onApplyFilters={handleApplyFilters}
        />

        {/* Dog Cards Grid */}
        {isLoading ? (
          <Grid container spacing={3} id="dog-cards-loading">
            {[...Array(8)].map((_, index) => (
              <Grid item key={`skeleton-${index}`} xs={12} sm={6} md={4} lg={3}>
                <DogCardSkeleton />
              </Grid>
            ))}
          </Grid>
        ) : dogs.length > 0 ? (
          <Grid container spacing={3} id="dog-cards-grid">
            {dogs.map((dog) => (
              <Grid item key={dog.id} xs={12} sm={6} md={4} lg={3} id={`dog-card-container-${dog.id}`}>
                <DogCard dog={dog} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <EmptyState
            onClearFilters={handleClearAllFilters}
            onApplyFilters={handleApplyFilters}
          />
        )}

        {/* Pagination */}
        {dogs.length > 0 && totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 6 }} id="pagination-container">
            <Pagination 
              count={totalPages} 
              page={currentPage} 
              onChange={handlePageChange} 
              color="primary" 
              disabled={isLoading}
              size="large"
              showFirstButton
              showLastButton
              id="dogs-pagination"
            />
          </Box>
        )}
      </Container>

      {/* Favorites Drawer */}
      <FavoritesSidebar 
        open={favoritesDrawerOpen}
        onClose={() => setFavoritesDrawerOpen(false)}
        onViewDogDetails={handleViewDogDetails}
      />

      {/* Back to Top Button */}
      <Zoom in={showBackToTop}>
        <Fab 
          color="primary" 
          size="medium" 
          aria-label="back to top"
          onClick={scrollToTop}
          sx={{ 
            position: 'fixed', 
            bottom: 20, 
            right: 20,
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          }}
          id="back-to-top-button"
        >
          <KeyboardArrowUp />
        </Fab>
      </Zoom>

      {/* Dog Details Modal */}
      <DogDetailsModal 
        open={dogDetailsModalOpen}
        onClose={() => setDogDetailsModalOpen(false)}
        dog={selectedDog}
      />
    </Box>
  );
};

export default SearchPage; 