import querystring from 'querystring';
import useSWR from 'swr';

const SPOTIFY_ENDPOINTS = {
    SEARCH: `https://api.spotify.com/v1/search`,
    TOP_TRACKS: `https://api.spotify.com/v1/me/top/tracks`,
    TOKEN: `https://accounts.spotify.com/api/token`,
    PLAYLISTS: `https://api.spotify.com/v1/me/playlists`,
};

const fetchWithToken = (url, token) => {
    // console.log('fetcher url?', url);
    // console.log('fetcher token?', token);
    const options = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };

    return fetch(url, options).then(response => response.json());
    // return fetch(SPOTIFY_ENDPOINTS.SEARCH + "?" + search_query_params, options).then(respone => response.json())
};

const useTopTracks = async (accessToken) => {
    const { data, error } = useSWR([SPOTIFY_ENDPOINTS.TOP_TRACKS, accessToken], fetchWithToken);
// console.log("accessToken top tracks", accessToken);
    //  console.log("useTopTracks data", data);
    
    return {
        data,
        is_loading: !error && !data,
        is_error: error,
    };
};

const getUserPlaylists = async (accessToken) => {
    return fetchWithToken(SPOTIFY_ENDPOINTS.PLAYLISTS, accessToken);
};

export default {
    useTopTracks,
    getUserPlaylists,
};

