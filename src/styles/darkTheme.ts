/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { roboto } from './roboto';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#007dc6',
      dark: '#004071',
      contrastText: '#000',
    },
    secondary: {
      main: '#53a546',
      contrastText: '#000',
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});
