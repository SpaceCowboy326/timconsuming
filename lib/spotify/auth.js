const API_ENDPOINTS = {
  AUTH: 'http://localhost:3000/api/spotify/auth',
  REFRESH: '/api/spotify/refresh',
};

// Retrieves a new access/refresh token from the Spotify API.
const getNewAccessToken = async (code) => {
  // const baseRedirectUrl = `${window.location.protocol}/${window.location.host}`;
  const params = new URLSearchParams({code})
  const response = await fetch(`${API_ENDPOINTS.AUTH}?${params}`);
  const tokenJson = await response.json();
  // console.log("text", text);

// console.log("Response!", response);
  return tokenJson;
  // return response.json();
}

const refreshAccessToken = async (refreshToken) => {
  const params = new URLSearchParams({refreshToken});
  const response = await fetch(`${API_ENDPOINTS.REFRESH}?${params}`);
  return await response.json();
}

export default {
    // getAccessToken,
    getNewAccessToken,
    refreshAccessToken,
    // SPOTIFY_SECRET,
    // SPOTIFY_CLIENT_ID,
    API_ENDPOINTS,
};