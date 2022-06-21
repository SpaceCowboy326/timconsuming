import querystring from 'querystring';
const REDIRECT_SUFFIX = '/listening';
const ENDPOINTS = {
  TOKEN: `https://accounts.spotify.com/api/token`,
};
const basic = new Buffer(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_SECRET).toString('base64');
  
const getNewAccessToken = async (req, res) => {
    const {query} = req;
    const {code} = query;
    const tokenOpts = {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basic}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: querystring.stringify({
          grant_type: 'authorization_code',
          code: code,
          client_id: process.env.SPOTIFY_CLIENT_ID,
          client_secret: process.env.SPOTIFY_SECRET,
          redirect_uri: process.env.SPOTIFY_REDIRECT_URI + REDIRECT_SUFFIX,
        })
    };

  const tokenResponse = await fetch(ENDPOINTS.TOKEN, tokenOpts);
  const tokenJson = await tokenResponse.json();
  return res.json(tokenJson);
}
  

export default getNewAccessToken;