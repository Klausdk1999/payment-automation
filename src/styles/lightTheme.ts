import { createTheme } from '@mui/material/styles';
import { roboto } from './roboto';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#648A5B',
      dark: '#4A5E45',
      contrastText: '#D1E3CD',
    },
    secondary: {
      main: '#2A3327',
    },
    error: {
      main: '#B30200',
    },
    background: {
      default: '#D1E3CD',
      paper: '#ffffff',
    },
    text: {
      primary: '#214347',
      secondary: '#2A3327',
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  components: {
    MuiInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#d9d9d9', // Light grey color
        },
      },
    },
  },
});
