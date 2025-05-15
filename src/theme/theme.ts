import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6a5acd', // Slateblue - more vibrant and premium
      light: '#8f7fe4',
      dark: '#483d8b',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff8c42', // Vibrant orange
      light: '#ffad6f',
      dark: '#e67e22',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f9f8ff', // Subtle light purple tint
      paper: '#ffffff',
    },
    text: {
      primary: '#2d3142', // Deeper, richer text color
      secondary: '#555b6e',
    },
    error: {
      main: '#e63946',
    },
    success: {
      main: '#4caf50',
    },
  },
  typography: {
    fontFamily: [
      'Poppins',
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          padding: '10px 20px',
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #6a5acd 30%, #8f7fe4 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #7b6bde 30%, #a090f5 90%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #ff8c42 30%, #ffad6f 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #ff9d53 30%, #ffbe80 90%)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 6px 16px rgba(0,0,0,0.06)',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0px 12px 20px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0px 4px 15px rgba(0,0,0,0.04)',
        },
        elevation2: {
          boxShadow: '0px 6px 18px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
        },
        colorPrimary: {
          background: 'linear-gradient(45deg, #6a5acd 30%, #8f7fe4 90%)',
        },
        colorSecondary: {
          background: 'linear-gradient(45deg, #ff8c42 30%, #ffad6f 90%)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 15px rgba(0,0,0,0.06)',
          backdropFilter: 'blur(8px)',
          borderRadius: 0,
          background: 'rgba(255, 255, 255, 0.8)',
          color: '#2d3142',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: '0 0 0 24px',
          boxShadow: '-4px 0px 20px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0,0,0,0.06)',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover': {
            backgroundColor: 'rgba(106, 90, 205, 0.05)',
          },
        },
      },
    },
  },
});

export default theme; 