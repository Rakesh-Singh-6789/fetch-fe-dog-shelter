import React, { useState } from 'react';
import { 
  Card, CardContent, Typography, IconButton, Box, Chip, CardActionArea,
  Modal, Paper, Grid, Divider, Button, Snackbar, Alert, ButtonGroup, Tooltip
} from '@mui/material';
import { 
  Favorite, FavoriteBorder, Pets, LocationOn, Close, 
  Share, ContentCopy, Facebook, Twitter
} from '@mui/icons-material';
import { Dog } from '../types/types';
import { useFavorites } from '../context/FavoritesContext';
import { transformDogImageUrl } from '../services/api';

interface DogCardProps {
  dog: Dog;
}

const DogCard: React.FC<DogCardProps> = ({ dog }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorited = isFavorite(dog.id);
  const [imgError, setImgError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    if (favorited) {
      removeFavorite(dog.id);
    } else {
      addFavorite(dog);
    }
  };

  const handleImgError = () => {
    setImgError(true);
  };

  const handleCardClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setShowShareOptions(false);
  };

  const handleToggleShareOptions = () => {
    setShowShareOptions(!showShareOptions);
  };

  const handleCopyLink = () => {
    // In a real app, this would be a shareable URL to the dog profile
    const shareableText = `[PLACEHOLDER] In a real app, this would be a shareable link to ${dog.name}'s profile. Check out ${dog.name}, a ${dog.age}-year-old ${dog.breed}!`;
    navigator.clipboard.writeText(shareableText)
      .then(() => {
        setSnackbarMessage('Link copied to clipboard! (In a real app, this would be a shareable URL)');
        setSnackbarOpen(true);
      })
      .catch(() => {
        setSnackbarMessage('Failed to copy link');
        setSnackbarOpen(true);
      });
  };

  const handleShareOnSocial = (platform: 'facebook' | 'twitter') => {
    // In a real app, this would open a social media share dialog
    // Here we'll just show a message that it would share
    setSnackbarMessage(`Would share on ${platform} in a real app`);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          overflow: 'visible',
          borderRadius: 3,
          boxShadow: '0 10px 30px rgba(0,0,0,0.07)',
          border: '1px solid rgba(255,255,255,0.7)',
          background: 'linear-gradient(145deg, #ffffff, #f5f5ff)',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          '&:hover': {
            transform: 'translateY(-12px) scale(1.02)',
            boxShadow: '0 15px 35px rgba(106, 90, 205, 0.15)',
          },
          cursor: 'pointer'
        }}
        onClick={handleCardClick}
      >
        <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
          {imgError ? (
            <Box
              sx={{
                height: 220,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f4f2ff 0%, #e9e7ff 100%)',
                color: 'text.secondary',
                padding: 2,
                textAlign: 'center'
              }}
            >
              <Pets sx={{ fontSize: 70, opacity: 0.6, mb: 1, color: 'primary.main' }} />
              <Typography variant="body2" color="text.secondary" fontWeight="medium">
                No Image Available
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.7rem' }}>
                CORS domain issue. Check README.md.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ position: 'relative' }}>
              <Box
                component="img"
                src={transformDogImageUrl(dog.img)}
                alt={dog.name}
                sx={{ 
                  height: 220,
                  width: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.6s ease',
                  filter: 'contrast(1.05)',
                  '&:hover': {
                    transform: 'scale(1.08)',
                  }
                }}
                onError={handleImgError}
                referrerPolicy="no-referrer"
              />
              {/* Subtle gradient overlay */}
              <Box 
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '40%',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%)',
                  zIndex: 1
                }}
              />
            </Box>
          )}
          
          {/* Favorite button with animation */}
          <IconButton
            onClick={handleFavoriteToggle}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(4px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              zIndex: 2,
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'scale(1.15) rotate(5deg)',
                bgcolor: 'rgba(255,255,255,0.95)',
              }
            }}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            {favorited ? (
              <Favorite sx={{ color: '#e63946', fontSize: 20 }} />
            ) : (
              <FavoriteBorder sx={{ color: '#777', fontSize: 20 }} />
            )}
          </IconButton>
        </Box>

        <CardContent sx={{ 
          pt: 2.5, 
          pb: '16px !important',
          px: 2.5,
          display: 'flex', 
          flexDirection: 'column', 
          flexGrow: 1,
          position: 'relative', 
          zIndex: 1
        }}>
          <Typography 
            variant="h6" 
            component="h2"
            sx={{ 
              fontWeight: 600,
              color: 'text.primary',
              mb: 0.5,
              fontSize: '1.1rem',
              letterSpacing: '-0.01em',
              pl: 0.5
            }}
          >
            {dog.name}
          </Typography>
          
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ pl: 0.5 }}>
              {dog.age} {dog.age <= 1 ? 'year' : 'years'} old
            </Typography>
            
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                fontSize: '0.85rem',
                color: 'text.secondary'
              }}
            >
              <LocationOn 
                sx={{ 
                  fontSize: 18, 
                  color: 'secondary.main', 
                  mr: 0.5,
                  mt: '-2px'
                }} 
              />
              <Typography variant="body2">
                {dog.zip_code}
              </Typography>
            </Box>
          </Box>

          <Chip
            label={dog.breed}
            size="small"
            sx={{
              position: 'absolute',
              top: -14,
              left: 16,
              backgroundColor: 'primary.main',
              color: 'white',
              fontWeight: 600,
              height: 28,
              fontSize: '0.75rem',
              boxShadow: '0 2px 8px rgba(106, 90, 205, 0.25)',
              '& .MuiChip-label': { px: 1.5 }
            }}
          />
        </CardContent>
      </Card>

      {/* Dog Details Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby={`dog-details-${dog.id}`}
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          p: 2
        }}
      >
        <Paper 
          sx={{ 
            maxWidth: 600, 
            width: '100%', 
            maxHeight: '90vh',
            overflowY: 'auto',
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            position: 'relative',
            outline: 'none',
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              zIndex: 1,
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' }
            }}
            aria-label="close"
          >
            <Close />
          </IconButton>

          <Box sx={{ position: 'relative' }}>
            {imgError ? (
              <Box
                sx={{
                  height: 250,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                  color: 'text.secondary'
                }}
              >
                <Pets sx={{ fontSize: 100, opacity: 0.6, mb: 1 }} />
                <Typography variant="body1" color="text.secondary">
                  No image available
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.7rem' }}>
                CORS restriction on image urls as different domain. Please check out README.md for more information.
              </Typography>
              </Box>
            ) : (
              <Box
                component="img"
                src={transformDogImageUrl(dog.img)}
                alt={dog.name}
                sx={{ 
                  width: '100%',
                  height: 250,
                  objectFit: 'cover',
                  borderRadius: '12px 12px 0 0'
                }}
                onError={handleImgError}
                referrerPolicy="no-referrer"
              />
            )}
          </Box>

          <Box sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                    {dog.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      onClick={handleToggleShareOptions}
                      color={showShareOptions ? 'primary' : 'default'}
                      aria-label="share"
                      sx={{ 
                        '&:hover': { transform: 'scale(1.1)' },
                        transition: 'transform 0.2s ease'
                      }}
                    >
                      <Share />
                    </IconButton>
                    <IconButton
                      onClick={handleFavoriteToggle}
                      color={favorited ? 'error' : 'default'}
                      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
                      sx={{ 
                        '&:hover': { transform: 'scale(1.1)' },
                        transition: 'transform 0.2s ease'
                      }}
                    >
                      {favorited ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                  </Box>
                </Box>
              </Grid>

              {showShareOptions && (
                <Grid item xs={12}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      gap: 1, 
                      p: 2,
                      bgcolor: 'action.hover',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', mb: 1 }}>
                      Note: This is a demo feature. In a real app, these options would share a link to this dog's profile.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Tooltip title="Copy link">
                        <IconButton onClick={handleCopyLink} size="small">
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Share on Facebook">
                        <IconButton onClick={() => handleShareOnSocial('facebook')} size="small" sx={{ color: '#1877F2' }}>
                          <Facebook fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Share on Twitter">
                        <IconButton onClick={() => handleShareOnSocial('twitter')} size="small" sx={{ color: '#1DA1F2' }}>
                          <Twitter fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Grid>
              )}

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Age
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {dog.age} {dog.age === 1 ? 'year' : 'years'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Breed
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {dog.breed}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <LocationOn color="secondary" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    Located at ZIP code: {dog.zip_code}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    onClick={handleFavoriteToggle}
                    startIcon={favorited ? <Favorite /> : <FavoriteBorder />}
                  >
                    {favorited ? 'Remove from Favorites' : 'Add to Favorites'}
                  </Button>
                  <Tooltip title="In a real app, this would share a link to this dog's profile">
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleToggleShareOptions}
                      startIcon={<Share />}
                    >
                      Share
                    </Button>
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Modal>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DogCard; 