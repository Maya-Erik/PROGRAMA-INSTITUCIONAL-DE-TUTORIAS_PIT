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

// Definir sombras completas (25 elementos)
const lightShadows = [
  'none',
  '0px 2px 4px rgba(0,0,0,0.05)',
  '0px 4px 8px rgba(0,0,0,0.08)',
  '0px 8px 16px rgba(0,0,0,0.1)',
  '0px 12px 24px rgba(0,0,0,0.1)',
  '0px 16px 32px rgba(0,0,0,0.1)',
  '0px 20px 40px rgba(0,0,0,0.1)',
  '0px 24px 48px rgba(0,0,0,0.1)',
  '0px 28px 56px rgba(0,0,0,0.1)',
  '0px 32px 64px rgba(0,0,0,0.1)',
  '0px 36px 72px rgba(0,0,0,0.1)',
  '0px 40px 80px rgba(0,0,0,0.1)',
  '0px 44px 88px rgba(0,0,0,0.1)',
  '0px 48px 96px rgba(0,0,0,0.1)',
  '0px 52px 104px rgba(0,0,0,0.1)',
  '0px 56px 112px rgba(0,0,0,0.1)',
  '0px 60px 120px rgba(0,0,0,0.1)',
  '0px 64px 128px rgba(0,0,0,0.1)',
  '0px 68px 136px rgba(0,0,0,0.1)',
  '0px 72px 144px rgba(0,0,0,0.1)',
  '0px 76px 152px rgba(0,0,0,0.1)',
  '0px 80px 160px rgba(0,0,0,0.1)',
  '0px 84px 168px rgba(0,0,0,0.1)',
  '0px 88px 176px rgba(0,0,0,0.1)',
  '0px 92px 184px rgba(0,0,0,0.1)',
] as const;

const darkShadows = [
  'none',
  '0px 2px 4px rgba(0,0,0,0.2)',
  '0px 4px 8px rgba(0,0,0,0.25)',
  '0px 8px 16px rgba(0,0,0,0.25)',
  '0px 12px 24px rgba(0,0,0,0.25)',
  '0px 16px 32px rgba(0,0,0,0.25)',
  '0px 20px 40px rgba(0,0,0,0.25)',
  '0px 24px 48px rgba(0,0,0,0.25)',
  '0px 28px 56px rgba(0,0,0,0.25)',
  '0px 32px 64px rgba(0,0,0,0.25)',
  '0px 36px 72px rgba(0,0,0,0.25)',
  '0px 40px 80px rgba(0,0,0,0.25)',
  '0px 44px 88px rgba(0,0,0,0.25)',
  '0px 48px 96px rgba(0,0,0,0.25)',
  '0px 52px 104px rgba(0,0,0,0.25)',
  '0px 56px 112px rgba(0,0,0,0.25)',
  '0px 60px 120px rgba(0,0,0,0.25)',
  '0px 64px 128px rgba(0,0,0,0.25)',
  '0px 68px 136px rgba(0,0,0,0.25)',
  '0px 72px 144px rgba(0,0,0,0.25)',
  '0px 76px 152px rgba(0,0,0,0.25)',
  '0px 80px 160px rgba(0,0,0,0.25)',
  '0px 84px 168px rgba(0,0,0,0.25)',
  '0px 88px 176px rgba(0,0,0,0.25)',
  '0px 92px 184px rgba(0,0,0,0.25)',
] as const;

// Tema claro
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
  shadows: lightShadows,
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
          boxShadow: lightShadows[2],
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: lightShadows[4],
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

// Tema oscuro
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: primaryColors,
    secondary: secondaryColors,
    success: { main: statusColors.success },
    error: { main: statusColors.error },
    warning: { main: statusColors.warning },
    info: { main: statusColors.info },
    background: {
      default: '#121212',
      paper: '#1e1e2e',
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#a0a0a0',
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
  shadows: darkShadows,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          padding: '8px 24px',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: '#1e1e2e',
          transition: 'transform 0.2s ease',
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
          background: '#1e1e2e',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          background: '#1e1e2e',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          backgroundColor: primaryColors.dark,
          color: '#ffffff',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          '&.Mui-selected': {
            color: secondaryColors.main,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: secondaryColors.main,
          height: 3,
        },
      },
    },
  },
});