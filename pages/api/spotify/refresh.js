import querystring from 'querystring';

const ENDPOINTS = {
    TOKEN: `https://accounts.spotify.com/api/token`,
};
const basic = new Buffer(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_SECRET).toString('base64');
  
const refreshAccessToken = async (req, res) => {
    const {query} = req;
    const refreshToken = query.refreshToken;
    
    const refreshOpts = {
        method: 'POST',
        headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: querystring.stringify({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        })
    };
    const refreshResponse = await fetch(ENDPOINTS.TOKEN, refreshOpts);
    console.log("refresh response", refreshResponse);
    const refreshJson = await refreshResponse.json();
    return res.json(refreshJson);
};


export default refreshAccessToken;