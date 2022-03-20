// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import querystring from 'querystring';
// const REDIRECT_URI = `http://localhost:3000/listening`;

// const generateRandomString = length => {
//     let text = '';
//     const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

//     for (let i = 0; i < length; i++) {
//       text += possible.charAt(Math.floor(Math.random() * possible.length));
//     }
//     return text;
// };
const REDIRECT_SUFFIX = '/listening';
const ENDPOINTS = {
  TOKEN: `https://accounts.spotify.com/api/token`,
};
const basic = new Buffer(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_SECRET).toString('base64');
  
const getNewAccessToken = async (req, res) => {
    const {query} = req;
    const {code} = query;
    // const redirectUri = `${baseRedirectUrl}/${REDIRECT_SUFFIX}`;
    // console.log("AUTH redirect to", redirectUri);
    console.log("red uri", process.env.SPOTIFY_REDIRECT_URI + REDIRECT_SUFFIX);
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
  // console.log("Full res", tokenResponse);
  
  // const resHeaders = tokenResponse.headers;
  // console.log("RES headers", resHeaders);
  // console.log("")
  // const tokenJson = await tokenResponse.text();
  const tokenJson = await tokenResponse.json();
  // console.log("TokenJSON", tokenJson);
  return res.json(tokenJson);
}
  

export default getNewAccessToken;