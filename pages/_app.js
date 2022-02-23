import '../styles/globals.css'
import '../styles/index.module.scss';

import {useState} from 'react';
import App from "next/app"
import Layout, {SpotifyAuthContext, SpotifyPlayerContext} from '../pages/components/layout'
import auth from './lib/spotify/auth'
import { ThemeProvider, responsiveFontSizes, StyledEngineProvider, createTheme, adaptV4Theme } from '@mui/material/styles';


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
        // mode: "dark",
        // primary: {
        // main: '#b6c4f4',
        // },
        // secondary: {
        // main: '#f3d885',
        // },
        type: 'light',
        primary: {
          main: '#81d4fa',
        },
        secondary: {
          main: '#F5AE0A',
          contrastText: '#FFFFFF',
        },
        background: {
          paper: '#81d4fa',
        },
        tertiary: {
          main: "#3f51b5",
        },
        spotify: {
          main: '#20526b'
        }
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            // backgroundColor: 'primary.main',
          }
        }
      },
      MuiTextField: {
      }
    }
});
theme = responsiveFontSizes(theme);

const getSelectedPage = (path) => {
  return path.substring(1);
}

function MyApp(props) {
  const { Component, pageProps, router, access_token, refresh_token } = props;
  const selected_page = getSelectedPage(router.route);

  // console.log("props be like", props);
  console.log("Rendering _app");

  return (
      <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <SpotifyAuthContext.Provider value={{access_token, refresh_token}}>
                <Layout selectedPage={selected_page}>
                  <Component {...pageProps} />
                </Layout>
            </SpotifyAuthContext.Provider>
          </ThemeProvider>
      </StyledEngineProvider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  // console.log("appContext", appContext);
  // console.log("context", ctx);
  // console.log("base_props", base_props);
  // return base_props;
  const {ctx, Component} = appContext;
  const {req, res, query} = ctx;
  const props = {};
  const code = query.code;
  
  // const token_response = await fetch('http://localhost:3000/api/token');
  let access_token, refresh_token, expires_in;
  if (code) {
    const token_response = await auth.getNewAccessToken(code);
    // console.log("What's the token response?", token_response);
    props.access_token = token_response.access_token;
    props.refresh_token = token_response.refresh_token;
    props.expires_in = token_response.expires_in;
  }
  // const json_token = await token_response.text();
  // console.log("What's the token json?", json_token);
  let base_props = {};
  base_props = await App.getInitialProps(appContext);
  // if (Component.getInitialProps) {
  //   // base_props = await Component.getInitialProps(ctx);
  //   base_props = await Component.getInitialProps(appContext);
  // }
  Object.assign(props, base_props);
  return props;
};


export default MyApp
