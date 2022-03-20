import Head from 'next/head'
// import Image from 'next/image'
import { useRouter } from 'next/router'
import auth from '../../lib/spotify/auth'
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Fade, Link, Paper, Typography } from '@mui/material';
import SpotifyPlayer from '../spotify-player';
import TopNav from './topNav';
import Title from './title';
import Footer from './footer';
import WebPlayer from '../../lib/spotify/web-player'
const fadeAnimationDuration = 350;
const SpotifyAuthContext = React.createContext({accessToken: null, refresh_token: null, device_id: null});
const SPOTIFY_REFRESH_TOKEN_KEY = 'spotify_refresh_token';
export {SpotifyAuthContext};

const Layout = ({
    children,
    selectedPage,
    access_token,
    refresh_token,
}) => {
    const router = useRouter();
    // Leaving as an example of how to pass query params in case it's necessary later
    // const {previous} = router.query;
    const [transition, setTransition] = useState(true);
    const [spotifyPlayer, setSpotifyPlayer] = useState(null);
    const [spotifyPlaybackReady, setSpotifyPlaybackReady] = useState(false);
    const [refreshToken, setRefreshToken] = useState(refresh_token);
    const [accessToken, setAccessToken] = useState(access_token);
    const [accessTokenRequiresRefresh, setAccessTokenRequiresRefresh] = useState(false);


    // Remove the "code" sent by Spotify redirect so we don't attempt to request a new access token
    // with the same code on refresh. Also, it's ugly.
    useEffect(() => {
        if (router.query.code) {
            router.replace(`/${selectedPage}`);
        }
    }, []);

    useEffect(() => {
        setTransition(true);
    }, [selectedPage]);

    // Setup a listener for when the spotify SDK loads
    useEffect(() => {
        // The spotify web player SDK will automatically call this function once the SDK has been initialized
        window.onSpotifyWebPlaybackSDKReady = () => {
            setSpotifyPlaybackReady(true);
        }
        return () => delete window.onSpotifyWebPlaybackSDKReady;
    }, [setSpotifyPlaybackReady]);

    // Once the playback SDK library is initialized and a Spotify Access Token is available, we can initialize our own player.
    useEffect(() => {
        if (spotifyPlaybackReady && accessToken) {
            const player = WebPlayer.initializeSpotifyPlayer({accessToken: accessToken});
            setSpotifyPlayer(player);
        }
    }, [accessToken, spotifyPlaybackReady]);


    // Handles process of storing the refresh token in localStorage and retrieving the refresh token from localStorage if
    // none exists currently.
    useEffect(() => {
        const localStorageRefreshToken = localStorage.getItem(SPOTIFY_REFRESH_TOKEN_KEY);
        if (
            // If there is no localStorage token, save the current token.
            (!localStorageRefreshToken && refreshToken) ||
            // If there is a localStorage token and a current token but they do not match, overwrite localStorage.
            (localStorageRefreshToken && refreshToken && localStorageRefreshToken !== refreshToken)
        ) {
            localStorage.setItem(SPOTIFY_REFRESH_TOKEN_KEY, refreshToken);
        }
        // No current refresh token but found one in localStorage, add it to state
        else if (localStorageRefreshToken && !refreshToken) {
            setRefreshToken(localStorageRefreshToken);
        }
    }, [refreshToken]);

    // Sets a flag letting us know to refresh the access token. If the window has focus when this fires, it will
    // immediately mark the token as expired. If not, it will wait until the window is refocused to refresh the token.
    const invalidateAccessTokenOnFocus = useCallback(() => {
        if (document.hasFocus()) {
            setAccessTokenRequiresRefresh(true);
        }
        else {
            const invalidateAccessToken = () => {
                setAccessTokenRequiresRefresh(true);
                window.removeEventListener('focus', invalidateAccessToken)
            }
            window.addEventListener('focus', invalidateAccessToken);
        }
    }, [setAccessTokenRequiresRefresh]);

    // Handles refreshing the access token if necessary.
    useEffect(async () => {
        // Basically... we only want to refresh the token if there is no access token or the 'accessTokenRequiresRefresh'
        // flag has been set, and a refresh token is available. So if not that, then exit.
        if ((accessToken && !accessTokenRequiresRefresh) || !refreshToken) {
            return;
        }

        if (accessTokenRequiresRefresh) {
            setAccessTokenRequiresRefresh(false);
        }
        const refreshResponse = await auth.refreshAccessToken(refreshToken);
        // Refresh failed - remove the bad refresh token.
        if (!refreshResponse?.access_token) {
            localStorage.removeItem(SPOTIFY_REFRESH_TOKEN_KEY);
            setRefreshToken(null);
        }
        // Refresh request successful
        else {
            const {
                access_token: newAccessToken,
                expires_in: tokenExpireTime,
            } = refreshResponse;
            // Set a timeout that will fire once the access token is invalidated. This will set a state variable
            // letting us know to refresh the access token once again.
            const delayedInvalidate = setTimeout(invalidateAccessTokenOnFocus, tokenExpireTime * 1000)
            setAccessToken(newAccessToken);
            return () => clearTimeout(delayedInvalidate);
        }
    }, [refreshToken, accessToken, accessTokenRequiresRefresh, setAccessTokenRequiresRefresh, invalidateAccessTokenOnFocus])


    return (
        <SpotifyAuthContext.Provider value={{accessToken, refreshToken}}>
            <Head>
                <title>TimConsuming</title>
            </Head>
            <Box sx={{minHeight: '90vh'}}>
                <Title selectedPage={selectedPage} transition={transition}/>
                <TopNav selectedPage={selectedPage} setTransition={setTransition} transition={transition}/>
                    <Fade in={transition} timeout={fadeAnimationDuration}>
                        {/* Fade seems to have a problem with certain elements being children. I think it has to do with not having forwardRef
                        implemented, but adding a <div> is a simple workaround. */}
                        <div>
                            {children}
                        </div>
                    </Fade>
            </Box>
            {selectedPage && <Footer show={transition}/>}
            {selectedPage && <SpotifyPlayer token={accessToken} player={spotifyPlayer}></SpotifyPlayer>}
            {/* </Box> */}
        </SpotifyAuthContext.Provider>
    );
}

export default Layout;