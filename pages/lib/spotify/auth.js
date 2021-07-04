import querystring from 'querystring';
// const {
//   SPOTIFY_CLIENT_ID: client_id,
//   SPOTIFY_CLIENT_SECRET: client_secret,
//   SPOTIFY_REFRESH_TOKEN: refresh_token
// } = process.env;

const SPOTIFY_SECRET = '9da8ab02a6c74450a71fe8a9cc4e3aac';
const SPOTIFY_CLIENT_ID = '1f90e71054584104ad97e60db53e4d17';
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

const basic = new Buffer(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_SECRET).toString('base64');
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

// const getNewAccessToken = async (code) => {
//     const auth_opts = {
//         method: 'POST',
//         headers: {
//           Authorization: `Basic ${basic}`,
//           'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         body: querystring.stringify({
//           grant_type: 'authorization_code',
//           code: code,
//           redirect_uri: 'http://localhost:3000/listening',
//         })
//     };

//     const response = await fetch(ENDPOINTS.TOKEN, auth_opts);
//     return response.json();
// }

// const getNewAccessToken = async (code) => {
//   const auth_opts = {
//       method: 'POST',
//       headers: {
//         // Authorization: `Basic ${basic}`,
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       body: querystring.stringify({
//         grant_type: 'authorization_code',
//         code: code,
//         redirect_uri: 'http://localhost:3000/listening',
//       })
//   };

//   const response = await fetch('http://localhost:3000/api/spotify/auth', auth_opts);
//   return response.json();
// }

// Retrieves a new access/refresh token from the Spotify API.
const getNewAccessToken = async (code) => {
  const params = new URLSearchParams({code})
  const response = await fetch(`http://localhost:3000/api/spotify/auth?${params}`);
  const tokenJson = await response.json();
  // console.log("text", text);

// console.log("Response!", response);
  return tokenJson;
  // return response.json();
}


export default {
    // getAccessToken,
    getNewAccessToken,
    getScope,
    // SPOTIFY_SECRET,
    // SPOTIFY_CLIENT_ID,
    ENDPOINTS,
};