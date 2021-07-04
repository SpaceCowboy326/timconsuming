// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// const express = require("express");
// const fs = require("fs");
// const app = express();
// const cookieParser = require('cookie-parser');
// const request = require('request'); // "Request" library
// var cors = require('cors');
import querystring from 'querystring';


const SPOTIFY_SECRET = process.env.SPOTIFY_SECRET;
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;

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
  // const basic = 'dW5kZWZpbmVkOnVuZGVmaW5lZA==';
  // const basic = 'OWRhOGFiMDJhNmM3NDQ1MGE3MWZlOGE5Y2M0ZTNhYWM6MWY5MGU3MTA1NDU4NDEwNGFkOTdlNjBkYjUzZTRkMTc=';
  // const basic = new Buffer(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_SECRET).toString('base64');

  // const auth_str = bytes('{}:{}'.format(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_SECRET), 'utf-8')
	// const b64_auth_str = base64.b64encode(auth_str).decode('utf-8')
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
      const {query} = req;
      const code = query.code;
      const tokenOpts = {
          method: 'POST',
          headers: {
            Authorization: `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: querystring.stringify({
            grant_type: 'authorization_code',
            code: code,
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_SECRET,
            redirect_uri: REDIRECT_URI,
          })
      };

      console.log("tokenOpts", tokenOpts);
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', tokenOpts);
    // const tm_text = await tm_response.text();
    // console.log(tm_text);
    console.log("Full res", tokenResponse);
    
    const resHeaders = tokenResponse.headers;
    // console.log("RES headers", resHeaders);
    // const tokenJson = await tokenResponse.text();
    const tokenJson = await tokenResponse.json();
    console.log("TokenJSON", tokenJson);
    // return res.send(tokenJson);
    return res.json(tokenJson);

      // res.setHeader('Authorization', `Basic ${basic}`);
      // res.setHeader('Content-Type', 'application/x-www-form-urlencoded');
      // res.redirect('https://accounts.spotify.com/api/token');

      // const response = await fetch(ENDPOINTS.TOKEN, auth_opts);
  }
  

export default getNewAccessToken;