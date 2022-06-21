const SPOTIFY_ENDPOINTS = {
    CURRENTLY_PLAYING: `https://api.spotify.com/v1/me/player/currently-playing`,
    NEXT: `https://api.spotify.com/v1/me/player/next`,
    PAUSE: `https://api.spotify.com/v1/me/player/pause`,
    PLAY: `https://api.spotify.com/v1/me/player/play`,
    QUEUE: `https://api.spotify.com/v1/me/player/queue`,
    PLAYLISTS: `https://api.spotify.com/v1/me/playlists`,
    PLAYLIST: `https://api.spotify.com/v1/playlists`,
    PREVIOUS: `https://api.spotify.com/v1/me/player/previous`,
    SAVE_TRACK: `https://api.spotify.com/v1/me/tracks`,
    SEEK: `https://api.spotify.com/v1/me/player/seek`,
    TRACKS: `https://api.spotify.com/v1/tracks`,
    TRANSFER_PLAYBACK: `https://api.spotify.com/v1/me/player/`,
};

const createHeaders = ({token}) => { return {Authorization: `Bearer ${token}`} };

const spotifyFetch = async ({url, options = {}, device_id, token}) => {
    options.headers = createHeaders({token});
    let spotifyResponse = await fetch(url, options);

    if (spotifyResponse.status === 404 && device_id) {
        await transferPlayback({token, device_id});
        spotifyResponse = await fetch(url, options);
    }
    if (spotifyResponse.status === 200) {
        return spotifyResponse.json();
    }
    return spotifyResponse;
}

const play = async ({token, device_id, retry}) => {
    const options = {
        method: 'PUT',
    };

    return spotifyFetch({device_id, url: SPOTIFY_ENDPOINTS.PLAY, options, token});
};

const getCurrentlyPlaying = async ({token, device_id}) => {
    const options = {
        method: 'GET',
    };

    const currentlyPlayingResponse = await spotifyFetch({device_id, url: SPOTIFY_ENDPOINTS.CURRENTLY_PLAYING, options, token});
    return currentlyPlayingResponse;
}

const getPlaylist = async ({token, playlistId}) => {
    const options = {
        method: 'GET',
    };

    const playlistResponse = await spotifyFetch({url: `${SPOTIFY_ENDPOINTS.PLAYLIST}/${playlistId}`, options, token})
    return playlistResponse;
};

const currentlyPlayingToArtistAndTrack = (currentlyPlaying) => {
    if (!currentlyPlaying.item || !currentlyPlaying.item.artists) {
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

const seek = async ({token, position}) => {
    const queryParams = new URLSearchParams({position_ms: Math.trunc(position)}).toString();
    const options = {
        headers: createHeaders({token}),
        method: 'PUT',
    };

    return fetch(`${SPOTIFY_ENDPOINTS.SEEK}?${queryParams}`, options);
}
const queueTrack = async ({token, track}) => {
    const queryParams = new URLSearchParams({uri: track}).toString();
    const options = {
        headers: createHeaders({token}),
        method: 'POST',
    };

    return fetch(`${SPOTIFY_ENDPOINTS.QUEUE}?${queryParams}`, options);
}

const saveTrack = async ({accessToken, id}) => {
    const queryParams = new URLSearchParams({ids: [id]}).toString();
    const options = {
        headers: createHeaders({token: accessToken}),
        method: 'PUT',
    };

    return fetch(`${SPOTIFY_ENDPOINTS.SAVE_TRACK}?${queryParams}`, options);
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

// Initializes the Spotify Web Player.  Should only occur once per page load.
const initializeSpotifyPlayer = ({accessToken}) => {
    if (!accessToken || !Spotify) {
        return;
    }
    const player = new Spotify.Player({
      name: 'Web Playback SDK Quick Start Player',
      getOAuthToken: cb => { cb(accessToken); }
    });
    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

    // Ready
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
      player.device_id = device_id;
      transferPlayback({token: accessToken, device_id});
    });
  
    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });
  
    player.setName("TimConsuming Web Player")
    const playerIframe = document.querySelector('iframe[src="https://sdk.scdn.co/embedded/index.html"]');
    playerIframe.setAttribute('title', 'Spotify WebPlayer SDK');
    // Connect to the player!
    player.connect();
    return player;
};

const getUserPlaylists = async (token) => {
    return spotifyFetch({url: SPOTIFY_ENDPOINTS.PLAYLISTS, token});
};

const webPlayerLib = {
    currentlyPlayingToArtistAndTrack,
    getCurrentlyPlaying,
    getUserPlaylists,
    getPlaylist,
    initializeSpotifyPlayer,
    next,
    pause,
    play,
    playTrack,
    previous,
    queueTrack,
    saveTrack,
    seek,
    transferPlayback,
};

export default webPlayerLib