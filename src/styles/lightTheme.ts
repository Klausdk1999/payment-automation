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
      main: '#fea10d',
      dark: '#050b26',
      contrastText: '#eaeeed',
    },
    secondary: {
      main: '#7c7f8e',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#f9f9f8",
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