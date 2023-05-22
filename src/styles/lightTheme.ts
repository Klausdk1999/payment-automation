import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { roboto } from './roboto';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#00FF43',
      dark: '#b9b9b9',
      contrastText: '#000000',
    },
    secondary: {
      main: '#7c7f8e',
    },
    error: {
      main: '#00FF43',
    },
    background: {
      default: '#202020',
      paper: '#275c37',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b9b9b9',
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
