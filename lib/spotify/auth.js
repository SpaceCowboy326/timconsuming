const API_ENDPOINTS = {
  AUTH: `${process.env.SPOTIFY_REDIRECT_URI}/api/spotify/auth`,
  REFRESH: '/api/spotify/refresh',
};

// Retrieves a new access/refresh token from the Spotify API.
const getNewAccessToken = async (code) => {
  const params = new URLSearchParams({code})
  const response = await fetch(`${API_ENDPOINTS.AUTH}?${params}`);
  const tokenJson = await response.json();

  return tokenJson;
}

const refreshAccessToken = async (refreshToken) => {
  const params = new URLSearchParams({refreshToken});
  const response = await fetch(`${API_ENDPOINTS.REFRESH}?${params}`);
  return await response.json();
}

export default {
    getNewAccessToken,
    refreshAccessToken,
    API_ENDPOINTS,
};