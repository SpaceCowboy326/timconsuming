import querystring from 'querystring';
import useSWR from 'swr';

// const {
//   SPOTIFY_CLIENT_ID: client_id,
//   SPOTIFY_CLIENT_SECRET: client_secret,
//   SPOTIFY_REFRESH_TOKEN: refresh_token
// } = process.env;


const SPOTIFY_ENDPOINTS = {
    SEARCH: `https://api.spotify.com/v1/search`,
    TOP_TRACKS: `https://api.spotify.com/v1/me/top/tracks`,
    TOKEN: `https://accounts.spotify.com/api/token`,
};

const fetcher = (...args) => fetch(...args).then(res => res.json())

const default_search_query_params = {
    type: "artist",
    limit: 1,
};

const searchFetcher = async (artist_name, token) => {
    const search_query_params = new URLSearchParams({
        ...default_search_query_params,
        q: artist_name,
    });
    const options = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };

    return fetch(SPOTIFY_ENDPOINTS.SEARCH + "?" + search_query_params, options).then(response => {console.log(response);return response.json()})
    // return fetch(SPOTIFY_ENDPOINTS.SEARCH + "?" + search_query_params, options).then(respone => response.json())
};

const useArtistSearch = async (artist_data, token) => {
    const { data, error } = useSWR(artist_data && artist_data.name ? [artist_data.name, token] : null, searchFetcher);

     console.log("args artist data", artist_data);
    if (!error && !data && artist_data && artist_data.requiresFetch()) {
        artist_data.initiateFetch();
    }
    if (error) {
        console.log("We had a catastrophe.", error);
    }
    return {
        artist_search_data: data,
        is_loading: !error && !data,
        is_error: error,
    };
};

// const useSearchAllArtists = async (artists_data, token) => {
//     if (!artists_data || artists_data.length === 0) {
//         return;
//     }
//     artists_data.forEach(async (artist_data) => {
//         const spotify_artist_data = await useArtistSearch(artist_data.name, token);
//         artist_data.spotifyData = spotify_artist_data;
//     });
// };

export default {
    useArtistSearch,
    // useSearchAllArtists,
};


