const SPOTIFY_ENDPOINTS = {
    CURRENTLY_PLAYING: `https://api.spotify.com/v1/me/player/currently-playing`,
    NEXT: `https://api.spotify.com/v1/me/player/next`,
    PAUSE: `https://api.spotify.com/v1/me/player/pause`,
    PLAY: `https://api.spotify.com/v1/me/player/play`,
    QUEUE: `https://api.spotify.com/v1/me/player/queue`,
    PREVIOUS: `https://api.spotify.com/v1/me/player/previous`,
    TRACKS: `https://api.spotify.com/v1/tracks`,
    TRANSFER_PLAYBACK: `https://api.spotify.com/v1/me/player/`,
};

const createHeaders = ({token}) => { return {Authorization: `Bearer ${token}`} };

const play = async (token) => {
    const options = {
        headers: createHeaders({token}),
        method: 'PUT',
    };

    return fetch(SPOTIFY_ENDPOINTS.PLAY, options);
};

const getCurrentlyPlaying = async (token) => {
    const options = {
        headers: createHeaders({token}),
        method: 'GET',
    };

    return fetch(SPOTIFY_ENDPOINTS.CURRENTLY_PLAYING, options).then(resp => {console.log("RESP", resp); return resp.json()}).then(json => currentlyPlayingToArtistAndTrack(json));
}

const currentlyPlayingToArtistAndTrack = (currentlyPlaying) => {
    if (!currentlyPlaying.item && currentlyPlaying.item.artists) {
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

const playTrack = async ({token, track}) => {
    const options = {
        headers: createHeaders({token}),
        method: 'PUT',
        body: JSON.stringify({
            uris: [track],
        })
    };

    return fetch(SPOTIFY_ENDPOINTS.PLAY, options);
}

const queueTrack = async ({token, track}) => {
    const queryParams = new URLSearchParams({uri: track}).toString();
    const options = {
        headers: createHeaders({token}),
        method: 'POST',
    };

    return fetch(`${SPOTIFY_ENDPOINTS.QUEUE}?${queryParams}`, options);
}

const transferPlayback = async ({token, device_id}) => {
    const options = {
        headers: createHeaders({token}),
        method: 'PUT',
        body: JSON.stringify({
            device_ids: [device_id],
        })
    };

    return fetch(`${SPOTIFY_ENDPOINTS.TRANSFER_PLAYBACK}`, options);
}


export default {
    getCurrentlyPlaying,
    currentlyPlayingToArtistAndTrack,
    next,
    pause,
    play,
    playTrack,
    previous,
    queueTrack,
    transferPlayback,
};


