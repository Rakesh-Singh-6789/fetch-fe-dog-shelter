import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, IconButton, Button } from '@mui/material';
import { Pets, ExitToApp, ArrowBack } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const AppHeader: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isLoginPage = location.pathname === '/';
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  if (isLoginPage) return null;
  
  const isLocationPage = location.pathname === '/locations';
  
  return (
    <AppBar position="sticky" elevation={2}>
      <Toolbar>
        {isLocationPage && (
          <IconButton 
            color="inherit" 
            edge="start" 
            sx={{ mr: 2 }} 
            onClick={() => navigate('/search')}
            aria-label="back to search"
          >
            <ArrowBack />
          </IconButton>
        )}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexGrow: 1,
            cursor: 'pointer'
          }}
          onClick={() => navigate('/search')}
        >
          <Pets sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            Fetch Dog Shelter
          </Typography>
        </Box>
        {isAuthenticated && (
          <Button 
            color="inherit" 
            onClick={handleLogout}
            startIcon={<ExitToApp />}
          >
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader; 