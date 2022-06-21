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
  
const REDIRECT_SUFFIX = '/listening';

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
