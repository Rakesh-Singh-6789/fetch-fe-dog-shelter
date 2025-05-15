import React from 'react';
import { Box, Typography, Divider, Paper, Button } from '@mui/material';
import { Dog } from '../types/types';
import DogCard from './DogCard';
import { AutoAwesome, Favorite } from '@mui/icons-material';

interface MatchResultProps {
  matchResult: Dog;
  onViewDetails: (dog: Dog) => void;
  imgError: boolean;
  showCongratulationsText?: boolean;
}

const MatchResult: React.FC<MatchResultProps> = ({ 
  matchResult, 
  onViewDetails,
  imgError,
  showCongratulationsText = true
}) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Divider sx={{ 
        my: 3,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-13px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80px',
          height: '25px',
          background: 'linear-gradient(90deg, rgba(106, 90, 205, 0) 0%, rgba(106, 90, 205, 0.15) 50%, rgba(106, 90, 205, 0) 100%)',
          borderRadius: '50%',
          filter: 'blur(8px)',
        }
      }} />
      
      <Box 
        sx={{ 
          textAlign: 'center',
          mb: 3.5,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-30px',
            left: '0',
            right: '0',
            height: '100px',
            background: 'radial-gradient(circle, rgba(106, 90, 205, 0.08) 0%, rgba(106, 90, 205, 0) 70%)',
            zIndex: -1,
          }
        }}
      >
        <AutoAwesome 
          sx={{ 
            color: 'secondary.main',
            fontSize: 24,
            mb: 1,
            filter: 'drop-shadow(0 0 4px rgba(255, 140, 66, 0.5))'
          }} 
        />
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #6a5acd, #ff8c42)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0px 1px 2px rgba(0, 0, 0, 0.03)',
            letterSpacing: '-0.01em'
          }}
        >
          Your Perfect Match!
        </Typography>
      </Box>
      
      <Paper 
        elevation={0} 
        sx={{ 
          mb: 3, 
          borderRadius: 4,
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #ffffff, #f8f7ff)',
          border: '1px solid rgba(106, 90, 205, 0.1)',
          boxShadow: '0 8px 25px rgba(106, 90, 205, 0.12)',
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 15px 35px rgba(106, 90, 205, 0.18)',
          }
        }}
      >
        <DogCard dog={matchResult} />
      </Paper>
      
      {showCongratulationsText && (
        <Box 
          sx={{ 
            mt: 3, 
            py: 3,
            px: 3.5, 
            background: 'linear-gradient(135deg, rgba(106, 90, 205, 0.04) 0%, rgba(255, 140, 66, 0.04) 100%)', 
            borderRadius: 3,
            border: '1px solid rgba(106, 90, 205, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ 
            position: 'absolute',
            top: '-25px',
            right: '-25px',
            width: '80px',
            height: '80px',
            background: 'radial-gradient(circle, rgba(255, 140, 66, 0.2) 0%, rgba(255, 140, 66, 0) 70%)',
            borderRadius: '50%',
            opacity: 0.6
          }} />
          
          <Favorite 
            fontSize="small" 
            sx={{ 
              color: 'secondary.main', 
              mb: 1.5,
              filter: 'drop-shadow(0 0 2px rgba(255, 140, 66, 0.3))'
            }} 
          />
          
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 500,
              mb: 0.5,
              textAlign: 'center',
              color: 'primary.dark' 
            }}
          >
            Congratulations! You've been matched with {matchResult.name}
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              textAlign: 'center',
              color: 'text.secondary',
              lineHeight: 1.6
            }}
          >
            This adorable {matchResult.breed} is waiting to meet you!
          </Typography>
          
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={() => onViewDetails(matchResult)}
            sx={{ 
              mt: 2,
              borderRadius: '20px',
              textTransform: 'none',
              px: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 140, 66, 0.04)'
              }
            }}
          >
            View Details
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MatchResult; 