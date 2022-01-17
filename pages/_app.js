import '../styles/globals.css'
import '../styles/index.module.scss';

import {useState} from 'react';
import App from "next/app"
import Layout, {SpotifyAuthContext, SpotifyPlayerContext} from '../pages/components/layout'
import auth from './lib/spotify/auth'
import { ThemeProvider, createTheme } from '@material-ui/core/styles';


const bodyFont = "'Noto Sans SC', sans-serif;";
// const bodyFont = "'Rubik', sans-serif;";
// const bodyFont = avenirNextFont;
const theme = createTheme({
    typography: {
        // fontFamily: "'Rubik', sans-serif;", 
        // fontFamily: "'Amatic SC', cursive;", 
        // fontFamily: "'EB Garamond', serif",
        // fontFamily: "'Prata', serif",
        // fontFamily: "'Bungee Shade', cursive",
        // fontWeight: 700,
        // fontFamily: "'Noto Sans SC', sans-serif;",
        // fontFamily: "'Monoton', cursive",
        fontFamily: "'Bungee', cursive",
        h5: {
            lineHeight: '.8',
        },
        body1: {
            // fontFamily: "'Roboto'",
            fontFamily: bodyFont,
            fontWeight: 600,
        },
        body2: {
            // fontFamily: "'Roboto'",
            fontFamily: bodyFont,
        },
    },
    palette: {
        // type: "dark",
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
        },
    },
});

const PATH_TO_PAGE = {
  '/eating': 'eati'
};

const getSelectedPage = (path) => {
  return path.substring(1);
}

function MyApp(props) {
  const { Component, pageProps, router, access_token, refresh_token } = props;
  const selected_page = getSelectedPage(router.route);

  // console.log("props be like", props);
  console.log("Rendering _app");

  return <ThemeProvider theme={theme}>
    <SpotifyAuthContext.Provider value={{access_token, refresh_token}}>
        <Layout selectedPage={selected_page}>
          <Component {...pageProps} />
        </Layout>
    </SpotifyAuthContext.Provider>
  </ThemeProvider>;
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
