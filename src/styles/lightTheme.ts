/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { roboto } from './roboto';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#007dc6',
      dark: '#004071',
      contrastText: '#eaeeed',
    },
    secondary: {
      main: '#53a546',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#eaeeed",
    },
    text: {
      primary: '#212121',
      secondary: '#676767',
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});