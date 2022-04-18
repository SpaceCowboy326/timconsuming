// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// const express = require("express");
// const fs = require("fs");
// const app = express();
// const cookieParser = require('cookie-parser');
// const request = require('request'); // "Request" library
// var cors = require('cors');
const querystring = require('querystring');

const scope_collection = [
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'user-top-read',
    'streaming',
    'playlist-modify-private',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-library-modify',
];
  
const SPOTIFY_SECRET = process.env.SPOTIFY_SECRET;
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;

const PORT = '3000';
const REDIRECT_SUFFIX = '/listening';

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
    const spotifyRedirectUrl = 'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: process.env.SPOTIFY_CLIENT_ID,
            scope: scope_collection.join(' '),
            redirect_uri: `${process.env.SPOTIFY_REDIRECT_URI}${REDIRECT_SUFFIX}`,
            state: state
        })
    res.status(200).json({ redirect_url: spotifyRedirectUrl })
};
