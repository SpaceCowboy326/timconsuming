import querystring from 'querystring';
import useSWR from 'swr';

// const {
//   SPOTIFY_CLIENT_ID: client_id,
//   SPOTIFY_CLIENT_SECRET: client_secret,
//   SPOTIFY_REFRESH_TOKEN: refresh_token
// } = process.env;


const SPOTIFY_ENDPOINTS = {
    CURRENTLY_PLAYING: `https://api.spotify.com/v1/me/player/currently-playing`,
    NEXT: `https://api.spotify.com/v1/me/player/next`,
    PAUSE: `https://api.spotify.com/v1/me/player/pause`,
    PLAY: `https://api.spotify.com/v1/me/player/play`,
    PREVIOUS: `https://api.spotify.com/v1/me/player/previous`,
    TRACKS: `https://api.spotify.com/v1/tracks`,

    // CURRENTLY_PLAYING: `https://api.spotify.com/v1/me/player/`,
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

const getCurrentlyPlaying = async (token) => {
    const options = {
        headers: createHeaders({token}),
        method: 'GET',
    };

    console.log("options", options);
    // console.log("token", token);

    return fetch(SPOTIFY_ENDPOINTS.CURRENTLY_PLAYING, options).then(resp => {console.log("RESP", resp); return resp.json()}).then(json => currentlyPlayingToArtistAndTrack(json));
}

const currentlyPlayingToArtistAndTrack = (currentlyPlaying) => {
    if (!currentlyPlaying.item && currentlyPlaying.item.artists) {
        console.warn("WARNING! THIS IS NOT A TRACK! ABORT!");
        return;
    }

    const artistNames = currentlyPlaying.item.artists.map(artist => artist.name).join(", ");
    const trackName = currentlyPlaying.item.name;
    return `${artistNames} - ${trackName}`;
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
    getCurrentlyPlaying,
    next,
    pause,
    play,
    previous,
};


