// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// const express = require("express");
// const fs = require("fs");
// const app = express();
const querystring = require('querystring');
import auth from '../../lib/spotify/auth';
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

export default (req, res) => {
    const state = generateRandomString(16);
    // res.cookie(COOKIE_STATE_KEY, state);
    // your application requests authorization

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: SPOTIFY_CLIENT_ID,
            scope: auth.getScope(),
            redirect_uri: REDIRECT_URI,
            state: state
        }));
};
