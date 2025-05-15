import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Modal, IconButton, Grid, Divider, Button,
  Tooltip, Snackbar, Alert
} from '@mui/material';
import { 
  Favorite, FavoriteBorder, Pets, Close, Share, ContentCopy, 
  Facebook, Twitter, LocationOn
} from '@mui/icons-material';
import { Dog } from '../../types/types';
import { useFavorites } from '../../context/FavoritesContext';
import { transformDogImageUrl } from '../../services/api';

interface DogDetailsModalProps {
  dog: Dog | null;
  open: boolean;
  onClose: () => void;
  imgError?: boolean;
}

const DogDetailsModal: React.FC<DogDetailsModalProps> = ({ 
  dog, 
  open, 
  onClose,
  imgError: propImgError
}) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [imgError, setImgError] = useState(propImgError || false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  if (!dog) return null;

  const handleClose = () => {
    setShowShareOptions(false);
    onClose();
  };

  const handleImgError = () => {
    setImgError(true);
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

  const handleFavoriteToggle = () => {
    if (isFavorite(dog.id)) {
      removeFavorite(dog.id);
    } else {
      addFavorite(dog);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
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
            onClick={handleClose}
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
                      color={isFavorite(dog.id) ? 'error' : 'default'}
                      aria-label={isFavorite(dog.id) ? 'Remove from favorites' : 'Add to favorites'}
                      sx={{ 
                        '&:hover': { transform: 'scale(1.1)' },
                        transition: 'transform 0.2s ease'
                      }}
                    >
                      {isFavorite(dog.id) ? <Favorite /> : <FavoriteBorder />}
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
                    startIcon={isFavorite(dog.id) ? <Favorite /> : <FavoriteBorder />}
                  >
                    {isFavorite(dog.id) ? 'Remove from Favorites' : 'Add to Favorites'}
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

export default DogDetailsModal; 