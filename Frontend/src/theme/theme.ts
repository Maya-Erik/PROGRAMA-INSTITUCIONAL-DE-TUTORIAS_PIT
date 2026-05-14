import { createTheme } from '@mui/material';

// Colores principales
const primaryColors = {
  main: '#003DA5',
  light: '#2a6bc9',
  dark: '#002c7a',
  contrastText: '#ffffff',
};

const secondaryColors = {
  main: '#D6A600',
  light: '#e6c44d',
  dark: '#c09500',
  contrastText: '#001F54',
};

const statusColors = {
  success: '#28a745',
  error: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: primaryColors,
    secondary: secondaryColors,
    success: { main: statusColors.success },
    error: { main: statusColors.error },
    warning: { main: statusColors.warning },
    info: { main: statusColors.info },
    background: {
      default: '#F8F9FC',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a2e',
      secondary: '#4A5568',
    },
  },
  typography: {
    fontFamily: '"Lexend", "Montserrat", sans-serif',
    h1: { fontFamily: '"Lexend", sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Lexend", sans-serif', fontWeight: 700 },
    h3: { fontFamily: '"Lexend", sans-serif', fontWeight: 600 },
    h4: { fontFamily: '"Lexend", sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Lexend", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Lexend", sans-serif', fontWeight: 600 },
    button: { fontFamily: '"Montserrat", sans-serif', fontWeight: 600, textTransform: 'none' },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          padding: '8px 24px',
          fontWeight: 600,
        },
        containedPrimary: {
          backgroundColor: primaryColors.main,
          '&:hover': { backgroundColor: primaryColors.dark },
        },
        containedSecondary: {
          backgroundColor: secondaryColors.main,
          color: secondaryColors.contrastText,
          '&:hover': { backgroundColor: secondaryColors.dark },
        },
        outlinedPrimary: {
          borderColor: primaryColors.main,
          color: primaryColors.main,
          '&:hover': { backgroundColor: 'rgba(0, 61, 165, 0.08)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          backgroundColor: primaryColors.main,
          color: '#ffffff',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 600,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          '&.Mui-selected': {
            color: primaryColors.main,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: primaryColors.main,
          height: 3,
        },
      },
    },
  },
});