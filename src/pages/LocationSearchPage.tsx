import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Container, Grid, Typography, Paper, Pagination, 
  FormControl, InputLabel, Select, MenuItem, Chip,
  TextField, Button, CircularProgress, Alert, OutlinedInput,
  IconButton, Divider, SelectChangeEvent, InputAdornment
} from '@mui/material';
import { FilterAlt, Close, Place, ArrowBack, Check } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { searchLocations, fetchLocations } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useFilters } from '../context/FiltersContext';
import { Location, LocationSearchParams } from '../types/types';

const ITEMS_PER_PAGE = 20;

const LocationSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { selectedZipCodes, setSelectedZipCodes, setFiltersModified } = useFilters();
  
  // Search state
  const [locations, setLocations] = useState<Location[]>([]);
  const [totalLocations, setTotalLocations] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [prevCursor, setPrevCursor] = useState<string | undefined>(undefined);

  // Filters state
  const [city, setCity] = useState<string>('');
  const [states, setStates] = useState<string[]>([]);
  const [availableStates] = useState<string[]>([
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ]);
  
  // Bounding box state
  const [topLat, setTopLat] = useState<number | ''>('');
  const [bottomLat, setBottomLat] = useState<number | ''>('');
  const [leftLon, setLeftLon] = useState<number | ''>('');
  const [rightLon, setRightLon] = useState<number | ''>('');
  
  // UI state
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Load previously selected locations
  useEffect(() => {
    const loadSavedLocations = async () => {
      if (selectedZipCodes.length > 0) {
        try {
          // Fetch location data for the saved zip codes
          const locationData = await fetchLocations(selectedZipCodes);
          setSelectedLocations(locationData);
        } catch (error) {
          console.error('Error loading saved locations:', error);
        }
      }
    };

    loadSavedLocations();
  }, [selectedZipCodes]);

  // Fetch locations with current search params
  const fetchLocationsList = useCallback(async (page: number, resetPagination = false) => {
    setIsLoading(true);
    setError('');

    try {
      const params: LocationSearchParams = {
        size: ITEMS_PER_PAGE
      };

      if (city.trim()) {
        params.city = city;
      }

      if (states.length > 0) {
        params.states = states;
      }

      // Add bounding box if all values are provided
      if (topLat !== '' && bottomLat !== '' && leftLon !== '' && rightLon !== '') {
        params.geoBoundingBox = {
          top: Number(topLat),
          bottom: Number(bottomLat),
          left: Number(leftLon),
          right: Number(rightLon)
        };
      }

      // Handle pagination based on cursor
      if (!resetPagination) {
        if (page > currentPage && nextCursor) {
          params.from = nextCursor;
        } else if (page < currentPage && prevCursor) {
          params.from = prevCursor;
        }
      }

      const response = await searchLocations(params);
      setLocations(response.results);
      setTotalLocations(response.total);
      
      // Extract cursor values from the "next" and "prev" URLs if they exist
      // Handle different URL formats: could be full URL or just query params
      const extractFromParam = (url?: string) => {
        if (!url) return undefined;
        
        // The URL could be a full URL or just query parameters
        const fromMatch = url.match(/from=([^&]+)/);
        return fromMatch ? fromMatch[1] : undefined;
      };
      
      setNextCursor(extractFromParam(response.next));
      setPrevCursor(extractFromParam(response.prev));
    } catch (error) {
      console.error('Error fetching locations:', error);
      setError('Failed to load locations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [city, states, topLat, bottomLat, leftLon, rightLon, currentPage, nextCursor, prevCursor]);

  // Initial load and when search params change
  useEffect(() => {
    setCurrentPage(1);
    fetchLocationsList(1, true);
  }, [city, states, topLat, bottomLat, leftLon, rightLon, fetchLocationsList]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      fetchLocationsList(page);
    }
  };

  const handleStateSelect = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setStates(typeof value === 'string' ? value.split(',') : value);
  };

  const handleLocationSelect = (location: Location) => {
    if (!selectedLocations.some(loc => loc.zip_code === location.zip_code)) {
      setSelectedLocations([...selectedLocations, location]);
    }
  };

  const handleRemoveLocation = (zipCode: string) => {
    setSelectedLocations(selectedLocations.filter(loc => loc.zip_code !== zipCode));
  };

  const handleApplyLocations = () => {
    // Store selected zip codes in context
    const zipCodes = selectedLocations.map(location => location.zip_code);
    setSelectedZipCodes(zipCodes);
    
    // Set flag to indicate we're coming from location page
    sessionStorage.setItem('fromLocationPage', 'true');
    
    // Navigate back to search page
    navigate('/search');
  };

  const totalPages = Math.ceil(totalLocations / ITEMS_PER_PAGE);

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        // Add extra padding at the bottom when locations are selected to avoid content being covered by fixed button
        pb: selectedLocations.length > 0 ? 16 : 6, 
        bgcolor: 'background.default',
        position: 'relative'
      }}
    >
      <Container sx={{ pt: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Location Search
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Search for locations to filter dogs by ZIP code
        </Typography>

        {/* Currently Selected Locations Summary */}
        {selectedLocations.length > 0 && (
          <Paper elevation={2} sx={{ p: 2, mb: 4, borderRadius: 2, bgcolor: 'rgba(91, 75, 138, 0.05)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                Currently Selected Locations ({selectedLocations.length})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={handleApplyLocations}
                  startIcon={<Check fontSize="small" />}
                >
                  Apply
                </Button>
                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  onClick={() => setSelectedLocations([])}
                  startIcon={<Close fontSize="small" />}
                >
                  Clear All
                </Button>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedLocations.map((location) => (
                <Chip
                  key={location.zip_code}
                  size="medium"
                  label={`${location.city}, ${location.state} (${location.zip_code})`}
                  onDelete={() => handleRemoveLocation(location.zip_code)}
                  id={`location-search-page-chip-${location.zip_code}`}
                />
              ))}
            </Box>
          </Paper>
        )}

        {/* Search filters */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Search Filters
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="City"
                fullWidth
                value={city}
                onChange={(e) => setCity(e.target.value)}
                variant="outlined"
                placeholder="Enter city name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Place fontSize="small" color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="states-select-label">States</InputLabel>
                <Select
                  labelId="states-select-label"
                  multiple
                  value={states}
                  onChange={handleStateSelect}
                  input={<OutlinedInput label="States" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
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
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    },
                  }}
                >
                  {availableStates.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Geographic Bounding Box (Optional)
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <TextField
                    label="Top Latitude"
                    fullWidth
                    type="number"
                    value={topLat}
                    onChange={(e) => setTopLat(e.target.value ? Number(e.target.value) : '')}
                    InputProps={{
                      inputProps: { min: -90, max: 90, step: 0.000001 }
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    label="Bottom Latitude"
                    fullWidth
                    type="number"
                    value={bottomLat}
                    onChange={(e) => setBottomLat(e.target.value ? Number(e.target.value) : '')}
                    InputProps={{
                      inputProps: { min: -90, max: 90, step: 0.000001 }
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    label="Left Longitude"
                    fullWidth
                    type="number"
                    value={leftLon}
                    onChange={(e) => setLeftLon(e.target.value ? Number(e.target.value) : '')}
                    InputProps={{
                      inputProps: { min: -180, max: 180, step: 0.000001 }
                    }}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    label="Right Longitude"
                    fullWidth
                    type="number"
                    value={rightLon}
                    onChange={(e) => setRightLon(e.target.value ? Number(e.target.value) : '')}
                    InputProps={{
                      inputProps: { min: -180, max: 180, step: 0.000001 }
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => fetchLocationsList(1, true)}
                fullWidth
                startIcon={<FilterAlt />}
              >
                Search Locations
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress color="primary" />
          </Box>
        )}

        {/* Results */}
        {!isLoading && locations.length > 0 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                {totalLocations} Locations Found
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {locations.map((location) => (
                <Grid item xs={12} sm={6} md={4} key={location.zip_code}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      cursor: 'pointer',
                      border: selectedLocations.some(loc => loc.zip_code === location.zip_code) 
                        ? '2px solid' 
                        : '1px solid transparent',
                      borderColor: selectedLocations.some(loc => loc.zip_code === location.zip_code)
                        ? 'primary.main'
                        : 'transparent',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        transform: 'translateY(-4px)',
                        boxShadow: '0px 8px 16px rgba(0,0,0,0.12)',
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: '30%',
                        height: '30%',
                        background: selectedLocations.some(loc => loc.zip_code === location.zip_code) 
                          ? 'radial-gradient(circle at bottom right, rgba(91, 75, 138, 0.1), transparent 70%)'
                          : 'none',
                        borderTopLeftRadius: '100%',
                        zIndex: 0,
                      }
                    }}
                    onClick={() => handleLocationSelect(location)}
                  >
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box 
                          sx={{ 
                            bgcolor: 'primary.light', 
                            color: 'primary.contrastText',
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2
                          }}
                        >
                          <Place />
                        </Box>
                        <Box>
                          <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                            {location.city}
                          </Typography>
                          <Typography variant="subtitle1" color="text.secondary">
                            {location.state}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        ml: 1
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" fontWeight="medium" color="text.secondary" sx={{ width: 80 }}>
                            ZIP Code:
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {location.zip_code}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" fontWeight="medium" color="text.secondary" sx={{ width: 80 }}>
                            County:
                          </Typography>
                          <Typography variant="body2">
                            {location.county}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" fontWeight="medium" color="text.secondary" sx={{ width: 80 }}>
                            Lat/Long:
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {selectedLocations.some(loc => loc.zip_code === location.zip_code) && (
                        <Chip 
                          label="Selected" 
                          color="primary" 
                          size="small"
                          sx={{ 
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            borderRadius: '0 0 0 8px',
                            fontWeight: 'bold',
                          }}
                        />
                      )}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            
            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: selectedLocations.length > 0 ? 10 : 4 }}>
              <Pagination 
                count={totalPages} 
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          </>
        )}

        {/* No results */}
        {!isLoading && locations.length === 0 && (
          <Paper elevation={1} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h6">No locations found</Typography>
            <Typography variant="body1" color="textSecondary">
              Try adjusting your search filters
            </Typography>
          </Paper>
        )}

        {/* Bottom fixed apply button when locations are selected */}
        {selectedLocations.length > 0 && (
          <Box 
            sx={{ 
              position: 'fixed', 
              bottom: 0, 
              left: 0, 
              right: 0, 
              p: 2, 
              bgcolor: 'background.paper',
              borderTop: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'center',
              zIndex: 10,
              boxShadow: '0px -2px 10px rgba(0,0,0,0.1)'
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleApplyLocations}
              startIcon={<Check />}
              sx={{ px: 4, py: 1 }}
            >
              Apply {selectedLocations.length} Location{selectedLocations.length !== 1 ? 's' : ''}
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default LocationSearchPage; 