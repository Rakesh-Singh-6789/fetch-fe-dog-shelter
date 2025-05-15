import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, Typography, Drawer, List, ListItem, ListItemText, 
  ListItemSecondaryAction, IconButton, Button, Divider, Paper,
  Avatar, CircularProgress
} from '@mui/material';
import { Close, Favorite, Pets, LocationOn, DeleteOutline, AutoAwesome } from '@mui/icons-material';
import { Dog } from '../types/types';
import { useFavorites } from '../context/FavoritesContext';
import { findMatch, transformDogImageUrl } from '../services/api';
import MatchResult from './MatchResult';

interface FavoritesSidebarProps {
  open: boolean;
  onClose: () => void;
  onViewDogDetails: (dog: Dog) => void;
}

const FavoritesSidebar: React.FC<FavoritesSidebarProps> = ({ 
  open, 
  onClose,
  onViewDogDetails
}) => {
  const { favorites, clearFavorites, removeFavorite } = useFavorites();
  const [matchResult, setMatchResult] = useState<Dog | null>(null);
  const [isMatchLoading, setIsMatchLoading] = useState(false);
  const [favoriteImgErrors, setFavoriteImgErrors] = useState<Record<string, boolean>>({});
  const [matchImgError, setMatchImgError] = useState(false);
  const matchResultRef = useRef<HTMLDivElement>(null);

  const handleFavoriteImgError = (dogId: string) => {
    setFavoriteImgErrors(prev => ({
      ...prev,
      [dogId]: true
    }));
  };

  const handleMatchImgError = () => {
    setMatchImgError(true);
  };

  // Scroll to match result when it appears
  useEffect(() => {
    if (matchResult && matchResultRef.current) {
      matchResultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [matchResult]);

  const handleGenerateMatch = async () => {
    if (favorites.length === 0) {
      return;
    }

    setIsMatchLoading(true);
    setMatchResult(null);

    try {
      const favoriteIds = favorites.map(dog => dog.id);
      const matchResponse = await findMatch(favoriteIds);
      
      // Find the matched dog from favorites
      const matchedDog = favorites.find(dog => dog.id === matchResponse.match);
      
      if (matchedDog) {
        setMatchResult(matchedDog);
      }
    } catch (error) {
      console.error('Error generating match:', error);
    } finally {
      setIsMatchLoading(false);
    }
  };

  const handleDrawerClose = () => {
    setMatchResult(null); // Reset match result when drawer closes
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleDrawerClose}
      PaperProps={{
        sx: {
          width: 380,
          boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(145deg, #ffffff, #f9f8ff)',
          borderLeft: '1px solid rgba(106, 90, 205, 0.1)',
        }
      }}
    >
      <Box sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <Box sx={{ 
          p: 3,
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(8px)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                bgcolor: 'rgba(255, 140, 66, 0.15)', 
                color: 'secondary.main',
                mr: 1.5 
              }}
            >
              <Favorite fontSize="small" />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Favorites ({favorites.length})
            </Typography>
          </Box>
          <IconButton 
            onClick={handleDrawerClose}
            sx={{
              bgcolor: 'rgba(0,0,0,0.03)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.06)' }
            }}
          >
            <Close />
          </IconButton>
        </Box>

        {/* Content area with scrolling */}
        <Box sx={{ 
          flexGrow: 1, 
          overflow: 'auto',
          px: 3,
          py: 2
        }}>
          {favorites.length > 0 ? (
            <>
              <List sx={{ mb: 3 }}>
                {favorites.map((dog) => (
                  <ListItem 
                    key={dog.id} 
                    sx={{ 
                      borderRadius: 3, 
                      mb: 1.5, 
                      bgcolor: 'background.paper',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                      overflow: 'hidden',
                      border: '1px solid rgba(0,0,0,0.03)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
                        bgcolor: 'rgba(106, 90, 205, 0.03)'
                      },
                      p: 0
                    }}
                    onClick={() => onViewDogDetails(dog)}
                    button
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      width: '100%', 
                      p: 1.5,
                      alignItems: 'center'
                    }}>
                      {favoriteImgErrors[dog.id] ? (
                        <Avatar
                          sx={{ 
                            width: 56, 
                            height: 56, 
                            borderRadius: 2,
                            mr: 2,
                            bgcolor: 'rgba(106, 90, 205, 0.1)',
                            color: 'primary.main'
                          }}
                        >
                          <Pets />
                        </Avatar>
                      ) : (
                        <Box 
                          component="img" 
                          src={transformDogImageUrl(dog.img)} 
                          alt={dog.name}
                          sx={{ 
                            width: 56, 
                            height: 56, 
                            borderRadius: 2,
                            objectFit: 'cover',
                            mr: 2,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                          onError={() => handleFavoriteImgError(dog.id)}
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {dog.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {dog.breed}
                          </Typography>
                          <Box 
                            component="span" 
                            sx={{ 
                              display: 'inline-block',
                              width: '4px',
                              height: '4px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(0,0,0,0.2)',
                              mx: 0.8
                            }}
                          />
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                          >
                            {dog.age} {dog.age === 1 ? 'yr' : 'yrs'}
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton 
                        edge="end" 
                        aria-label="remove" 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFavorite(dog.id);
                          // If this was the match result, clear it
                          if (matchResult && matchResult.id === dog.id) {
                            setMatchResult(null);
                          }
                        }}
                        size="small"
                        sx={{ 
                          color: 'text.secondary',
                          '&:hover': { 
                            color: 'error.main',
                            bgcolor: 'rgba(230, 57, 70, 0.08)'
                          }
                        }}
                      >
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>

              {/* Match buttons section */}
              <Box sx={{ 
                mb: 3,
                pb: 3,
                borderBottom: !matchResult ? '1px solid rgba(0,0,0,0.06)' : 'none'
              }}>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  disabled={isMatchLoading || favorites.length === 0}
                  onClick={handleGenerateMatch}
                  sx={{ 
                    mb: 1.5,
                    py: 1.2,
                    fontSize: '0.95rem',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                      zIndex: 1
                    }
                  }}
                  startIcon={isMatchLoading ? undefined : <AutoAwesome />}
                >
                  {isMatchLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                      Finding your match...
                    </Box>
                  ) : (
                    '✨ Find My Perfect Match ✨'
                  )}
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    clearFavorites();
                    setMatchResult(null);
                  }}
                  sx={{ 
                    color: 'text.secondary',
                    borderColor: 'rgba(0,0,0,0.12)',
                    '&:hover': {
                      borderColor: 'rgba(0,0,0,0.24)',
                      bgcolor: 'rgba(0,0,0,0.03)'
                    }
                  }}
                >
                  Clear All
                </Button>
              </Box>

              {/* Match Result */}
              {matchResult && (
                <Box ref={matchResultRef}>
                  <MatchResult 
                    matchResult={matchResult}
                    onViewDetails={onViewDogDetails}
                    imgError={matchImgError}
                    showCongratulationsText={true}
                  />
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ 
              py: 6, 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255,255,255,0.6)',
              borderRadius: 4,
              border: '1px dashed rgba(106, 90, 205, 0.2)',
              height: '60vh',
              m: 2
            }}>
              <Box 
                sx={{ 
                  width: 90, 
                  height: 90, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(255, 140, 66, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mb: 3,
                  p: 2,
                  boxShadow: '0 8px 24px rgba(255, 140, 66, 0.15)'
                }}
              >
                <Favorite sx={{ fontSize: 40, color: 'secondary.main' }} />
              </Box>
              <Typography variant="h6" color="text.primary" gutterBottom fontWeight={600}>
                No Favorites Yet
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  textAlign: 'center', 
                  maxWidth: '80%', 
                  mb: 3,
                  lineHeight: 1.7
                }}
              >
                Click the heart icon on dog cards to add them to your favorites. 
                Then find your perfect match with our matching algorithm!
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 1.5, 
                width: '100%', 
                maxWidth: 250,
                mt: 2
              }}>
                <Button 
                  variant="outlined" 
                  color="primary"
                  startIcon={<Pets />}
                  onClick={handleDrawerClose}
                  fullWidth
                  sx={{ py: 1.2 }}
                >
                  Browse Dogs
                </Button>
              </Box>
              <Box sx={{ 
                mt: 4, 
                p: 2.5, 
                bgcolor: 'rgba(106, 90, 205, 0.04)', 
                borderRadius: 3, 
                width: '100%',
                maxWidth: '85%',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
              }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontStyle: 'italic', 
                    textAlign: 'center',
                    color: 'primary.main',
                    lineHeight: 1.6
                  }}
                >
                  "Adding favorites helps our algorithm find your perfect furry friend match!"
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default FavoritesSidebar; 