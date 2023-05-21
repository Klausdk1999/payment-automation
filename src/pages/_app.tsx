import * as React from 'react';
// import { type AppType } from "next/app";
import Head from 'next/head';
import type { AppProps } from 'next/app';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import type { EmotionCache } from '@emotion/react';
import { CacheProvider } from '@emotion/react';
import { lightTheme } from '../../src/styles/lightTheme';
import createEmotionCache from '../../src/utils/createEmotionCache';
import "../styles/globals.css";

import { api } from "../utils/api";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Header } from '../components/Header';
import { Box } from '@mui/material';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function MyApp(props: MyAppProps) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>QuickPay</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={lightTheme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <ToastContainer autoClose={2000} />
        <Box sx={{ mt: '90px' }}>
          <Component {...pageProps}/>
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
}
export default api.withTRPC(MyApp);
