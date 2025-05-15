import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, Box } from '@mui/material';
import theme from './theme/theme';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import LocationSearchPage from './pages/LocationSearchPage';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { FiltersProvider } from './context/FiltersContext';
import AppHeader from './components/layout/AppHeader';
import ProtectedRoute from './routing/ProtectedRoute';
import { setupDocumentMeta } from './utils/favicon';

const App = () => {
  // Set document title and favicon
  useEffect(() => {
    setupDocumentMeta();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <FavoritesProvider>
          <FiltersProvider>
            <Router>
              <AppHeader />
              <Box sx={{ pt: 0 }}>
                <Routes>
                  <Route path="/" element={<LoginPage />} />
                  <Route 
                    path="/search" 
                    element={
                      <ProtectedRoute>
                        <SearchPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/locations" 
                    element={
                      <ProtectedRoute>
                        <LocationSearchPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Box>
            </Router>
          </FiltersProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App; 