import querystring from 'querystring';
import useSWR from 'swr';

// const {
//   SPOTIFY_CLIENT_ID: client_id,
//   SPOTIFY_CLIENT_SECRET: client_secret,
//   SPOTIFY_REFRESH_TOKEN: refresh_token
// } = process.env;


const SPOTIFY_ENDPOINTS = {
    PLAY: `	https://api.spotify.com/v1/me/player/play`,
    PAUSE: `	https://api.spotify.com/v1/me/player/pause`,
    PREVIOUS: `	https://api.spotify.com/v1/me/player/previous`,
    NEXT: `	https://api.spotify.com/v1/me/player/next`,
};

const fetcher = (...args) => fetch(...args).then(res => res.json())

const createHeaders = ({token}) => { return {Authorization: `Bearer ${token}`} };
const play = async (token) => {
    const options = {
        headers: createHeaders({token}),
        method: 'PUT',
    };

    console.log("options", options);
    // console.log("token", token);

    return fetch(SPOTIFY_ENDPOINTS.PLAY, options);
};

const pause = async (token) => {
    const options = {
        headers: createHeaders({token}),
        method: 'PUT',
    };

     console.log("options", options);
    //  console.log("token", token);

    return fetch(SPOTIFY_ENDPOINTS.PAUSE, options);
};

const next = async (token) => {
    const options = {
        headers: createHeaders({token}),
        method: 'POST',
    };

    return fetch(SPOTIFY_ENDPOINTS.NEXT, options);
};


const previous = async (token) => {
    const options = {
        headers: createHeaders({token}),
        method: 'POST',
    };

    return fetch(SPOTIFY_ENDPOINTS.PREVIOUS, options);
};



export default {
    play,
    pause,
    previous,
    next,
};


