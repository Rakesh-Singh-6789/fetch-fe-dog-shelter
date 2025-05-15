import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Button, Container, TextField, Typography, Paper, Alert,
  Grid, Card, CardContent, Avatar
} from '@mui/material';
import { Pets, Email, Phone, LocationOn } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '@mui/material/styles';

// SVG paw print for direct use in background-image
const purplePawPrintSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 100 100">
  <circle cx="50" cy="30" r="15" fill="#5b4b8a" opacity="0.5"/>
  <circle cx="30" cy="50" r="10" fill="#5b4b8a" opacity="0.5"/>
  <circle cx="70" cy="50" r="10" fill="#5b4b8a" opacity="0.5"/>
  <circle cx="40" cy="70" r="10" fill="#5b4b8a" opacity="0.5"/>
  <circle cx="60" cy="70" r="10" fill="#5b4b8a" opacity="0.5"/>
</svg>
`;

const orangePawPrintSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 100 100">
  <circle cx="50" cy="30" r="15" fill="#f7941d" opacity="0.5"/>
  <circle cx="30" cy="50" r="10" fill="#f7941d" opacity="0.5"/>
  <circle cx="70" cy="50" r="10" fill="#f7941d" opacity="0.5"/>
  <circle cx="40" cy="70" r="10" fill="#f7941d" opacity="0.5"/>
  <circle cx="60" cy="70" r="10" fill="#f7941d" opacity="0.5"/>
</svg>
`;

// Paw print path pattern coordinates - sine wave pattern
const generatePawPrintPath = () => {
  const pawPrints = [];
  
  // Create a sine wave pattern across the bottom of the screen
  // Use fewer paws with higher amplitude wave
  const totalPaws = 8;
  const baseBottom = 100; 
  const amplitude = 80; 
  const wavelength = 2 * Math.PI / totalPaws * 1.5; 
  
  for (let i = 0; i < totalPaws; i++) {
    // Calculate sine wave position
    const sineValue = Math.sin(i * wavelength);
    const bottomPosition = baseBottom + amplitude * sineValue;
    
    // Alternate purple and orange
    const isEven = i % 2 === 0;
    
    // Make the paws slightly different sizes
    const size = 50 + (isEven ? 10 : 0);
    
    // Calculate left position to spread across the screen
    const leftPosition = 5 + (i * (90 / (totalPaws - 1)) * 10);
    
    // Create rotation effect like a walking pattern
    const rotation = isEven ? 10 + (sineValue * 10) : -10 + (sineValue * 10);
    
    pawPrints.push({
      bottom: `${bottomPosition}px`,
      left: `${leftPosition}px`,
      size,
      svg: isEven ? purplePawPrintSvg : orangePawPrintSvg,
      rotation
    });
  }
  
  return pawPrints;
};

const pawPrintPositions = generatePawPrintPath();

const LoginPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const validateForm = (): boolean => {
    let isValid = true;
    
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      isValid = false;
    } else {
      setEmailError('');
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(name, email);
      navigate('/search');
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        py: 8,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: theme => theme.palette.background.default,
        background: 'linear-gradient(145deg, #f9f8ff 0%, #ffffff 100%)'
      }}
    >
      {/* Render SVG paw prints in sine wave pattern */}
      <Box sx={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        height: '200px',
        zIndex: 0, 
        pointerEvents: 'none' 
      }}>
        {pawPrintPositions.map((paw, index) => (
          <Box
            key={`paw-${index}`}
            sx={{
              position: 'absolute',
              ...paw,
              width: paw.size,
              height: paw.size,
              backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(paw.svg)}")`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              transform: `rotate(${paw.rotation}deg)`,
            }}
          />
        ))}
      </Box>
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} sx={{ display: 'flex', alignItems: 'center' }}>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    background: 'linear-gradient(45deg, #6a5acd 30%, #8f7fe4 90%)',
                    width: 56, 
                    height: 56, 
                    mr: 2,
                    boxShadow: '0 4px 10px rgba(106, 90, 205, 0.3)'
                  }}
                >
                  <Pets sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography 
                  variant="h3" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 700, 
                    background: 'linear-gradient(45deg, #6a5acd 30%, #8f7fe4 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.2
                  }}
                >
                  Fetch Dog Shelter
                </Typography>
              </Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 500, 
                  color: 'text.secondary' 
                }}
              >
                Find your perfect furry companion today!
              </Typography>
              <Typography variant="body1" paragraph>
                Welcome to our dog adoption platform where you can browse, search, and find your 
                perfect canine companion. We have dogs of all breeds, ages, and personalities 
                waiting for their forever homes.
              </Typography>
              <Typography variant="body1" paragraph>
                Log in to start your journey toward finding a new best friend!
              </Typography>
            </Box>
            
            {/* Visit Us and Contact Us cards at the bottom of left column */}
            <Grid container spacing={2} sx={{ mt: 'auto' }}>
              <Grid item xs={12} sm={6}>
                <Card elevation={1} sx={{ 
                  height: '100%',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0px 12px 20px rgba(0,0,0,0.12)',
                  },
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Visit Us</Typography>
                    </Box>
                    <Typography variant="body2">
                      1234 Paw Street<br />
                      Dogtown, DOG 12345<br />
                      Open daily: 10am - 6pm
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card elevation={1} sx={{ 
                  height: '100%',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0px 12px 20px rgba(0,0,0,0.12)',
                  },
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Phone color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Contact Us</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Phone: 1234567890
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Email fontSize="small" sx={{ mr: 0.5, opacity: 0.7 }} />
                      <Typography variant="body2">
                        rakeshsr6789@gmail.com
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                width: '100%',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(106, 90, 205, 0.15)',
                background: 'linear-gradient(145deg, #ffffff, #f5f5ff)',
                border: '1px solid rgba(106, 90, 205, 0.1)',
                backdropFilter: 'blur(8px)',
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(to right, #6a5acd, #ff8c42)',
                  borderRadius: '3px 3px 0 0'
                },
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 40px rgba(106, 90, 205, 0.2)',
                }
              }}
            >
              <Box 
                component="form" 
                onSubmit={handleSubmit} 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 3 
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="h4" 
                    component="h2" 
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      background: 'linear-gradient(45deg, #6a5acd 30%, #8f7fe4 90%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Log In
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Enter your details to start browsing
                  </Typography>
                </Box>

                {error && <Alert severity="error">{error}</Alert>}

                <TextField
                  label="Name"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={!!nameError}
                  helperText={nameError}
                  disabled={isLoading}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(106, 90, 205, 0.5)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#6a5acd',
                        borderWidth: 2,
                      }
                    }
                  }}
                />

                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!emailError}
                  helperText={emailError}
                  disabled={isLoading}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(106, 90, 205, 0.5)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#6a5acd',
                        borderWidth: 2,
                      }
                    }
                  }}
                />

                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large"
                  fullWidth
                  disabled={isLoading}
                  sx={{ 
                    mt: 2,
                    background: 'linear-gradient(45deg, #6a5acd 30%, #8f7fe4 90%)',
                    py: 1.5,
                    borderRadius: 3,
                    boxShadow: '0 4px 15px rgba(106, 90, 205, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(106, 90, 205, 0.4)',
                      background: 'linear-gradient(45deg, #7b6bde 30%, #a090f5 90%)',
                    }
                  }}
                  startIcon={<Pets />}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>

                <Typography variant="caption" align="center" sx={{ mt: 2, opacity: 0.7 }}>
                  By logging in, you agree to our terms and privacy policy.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginPage; 