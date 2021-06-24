// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// const express = require("express");
// const fs = require("fs");
// const app = express();
// const cookieParser = require('cookie-parser');
// const request = require('request'); // "Request" library
// var cors = require('cors');


const SPOTIFY_SECRET = auth.SPOTIFY_SECRET;
const SPOTIFY_CLIENT_ID = auth.SPOTIFY_CLIENT_ID;

const PORT = '3000';
const REDIRECT_URI = `http://localhost:3000/listening`;

const COOKIE_STATE_KEY = 'spotify_auth_state';
const COOKIE_ACCESS_KEY = 'spotify_auth_access';
const COOKIE_REFRESH_KEY = 'spotify_auth_refresh';


const generateRandomString = length => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};


const scope_collection = [
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'user-top-read',
    'streaming',
  ];
  
  const ENDPOINTS = {
    TOKEN: `https://accounts.spotify.com/api/token`
  };
  
  const basic = new Buffer(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_SECRET).toString('base64');
  // const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
  
  
  // Combine the collection of scopes required for the app as a single string that can be sent directly
  // to the spotify API
  const getScope = () => scope_collection.join(' ');
  
  // // uses a refresh token to retrieve a replacement access token
  // const getAccessToken = async (refresh_token) => {
  //   const response = await fetch(ENDPOINTS.TOKEN, {
  //     method: 'POST',
  //     headers: {
  //       Authorization: `Basic ${basic}`,
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     body: querystring.stringify({
  //       grant_type: 'refresh_token',
  //       refresh_token
  //     })
  //   });
  
  //   return response.json();
  // };
  
  const getNewAccessToken = async (req, res) => {
      const code = null; //TODO -get code from URL
      const auth_opts = {
          method: 'POST',
          headers: {
            Authorization: `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: querystring.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'http://localhost:3000/listening',
          })
      };
  
      const response = await fetch(ENDPOINTS.TOKEN, auth_opts);
      return response.json();
  }
  

export default getNewAccessToken;