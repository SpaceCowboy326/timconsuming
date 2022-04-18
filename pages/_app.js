import '../styles/globals.css'
// import '../styles/index.module.scss';

import {useEffect, useState} from 'react';
import App from "next/app"
// import Layour from '../components/'
import Layout, {SpotifyAuthContext, SpotifyPlayerContext} from '../components/layout/layout'
import auth from '../lib/spotify/auth'
import { ThemeProvider, responsiveFontSizes, StyledEngineProvider, createTheme, adaptV4Theme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    }
  }
});

const bodyFont = "'Noto Sans SC', sans-serif;";
let theme = createTheme({
    typography: {
        fontFamily: "'Bungee', cursive",
        h5: {
            // lineHeight: '.8',
        },
        body1: {
            fontFamily: bodyFont,
            fontWeight: 600,
        },
        body2: {
            fontFamily: bodyFont,
        },
    },
    palette: {
        type: 'light',
        primary: {
          main: '#81d4fa',
        },
        background: '#FFFFFF',
        secondary: {
          // main: '#3C4CAA',
          main: '#F5AE0A',
          contrastText: '#FFFFFF',
        },
        background: {
          // menulist: '#FFFFFF',
          paper: '#81d4fa',
        },
        tertiary: {
          main: "#3f51b5",
        },
        spotify: {
          main: '#20526b'
        }
    },
    // palette: {
    //   mode: "dark",
    //   primary: {
    //     main: '#121212',
    //   },
    //   secondary: {
    //     main: '#FF3F80',
    //   },
    //   tertiary: {
    //     main: '#3E50B4',
    //   },

    //   background: {
    //     // default: '#525252',
    //     paper: '#121212',
    //   },
    // },
});
theme = responsiveFontSizes(theme);

const getSelectedPage = (path) => {
  return path.substring(1);
}

function MyApp(props) {
  const { Component, pageProps, router, access_token, refresh_token } = props;
  const selectedPage = getSelectedPage(router.route);

  // console.log("Rendering _app");

  return (
    <StyledEngineProvider injectFirst>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            {/* <SpotifyAuthContext.Provider value={{accessToken, refreshToken}}> */}
                <Layout access_token={access_token} refresh_token={refresh_token} selectedPage={selectedPage}>
                  <Component {...pageProps} />
                </Layout>
            {/* </SpotifyAuthContext.Provider> */}
          </ThemeProvider>
        </QueryClientProvider>
    </StyledEngineProvider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const {ctx, Component} = appContext;
  const {req, res, query} = ctx;
  const additionalProps = {};
  const code = query.code;
  
  if (code) {
    const token_response = await auth.getNewAccessToken(code);
    additionalProps.access_token = token_response.access_token;
    additionalProps.refresh_token = token_response.refresh_token;
    additionalProps.expires_in = token_response.expires_in;
  }
  const baseProps = await App.getInitialProps(appContext);
  const props = {
    ...baseProps,
    ...additionalProps,
  }

  return props;
};

export default MyApp
