import React from 'react';
import { Card, CardContent, Box, Skeleton } from '@mui/material';

const DogCardSkeleton: React.FC = () => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 3,
        boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
      }}
    >
      <Skeleton 
        variant="rectangular" 
        height={200} 
        sx={{ borderRadius: '12px 12px 0 0' }} 
        animation="wave" 
      />
      <CardContent sx={{ pt: 2 }}>
        <Skeleton variant="text" height={32} width="80%" animation="wave" />
        <Box sx={{ display: 'flex', gap: 1, my: 1 }}>
          <Skeleton variant="rounded" height={24} width={60} animation="wave" />
          <Skeleton variant="rounded" height={24} width={100} animation="wave" />
        </Box>
        <Box sx={{ mt: 'auto', pt: 1 }}>
          <Skeleton variant="text" height={24} width="40%" animation="wave" />
        </Box>
      </CardContent>
    </Card>
  );
};

export default DogCardSkeleton; 