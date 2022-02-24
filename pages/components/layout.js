import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { Box, Fade, Link, Paper, Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import SpotifyPlayer from '../components/spotify-player';
// import Scrollbar from '../components/scrollbar';
// import avenirNextFont from '../../public/AvenirNextLTPro-Regular.otf';
import styles from '../../styles/index.module.scss';
import webPlayer from '../lib/spotify/web-player'
const fadeAnimationDuration = 750;

const navImages = {
    drinking: '/images/002-alcohol.svg',
    listening: '/images/headphone.svg',
    playing: '/images/gamepad.svg',
    watching: '/images/laptop.svg',
};

const PAGE_NAMES = ['drinking', 'watching', 'listening', 'playing'];
const PAGE_TO_TEXT = {
    drinking: 'Drinking',
    listening: 'Listening To',
    playing: 'Playing',
    watching: 'Watching',
};

const navPopEffect = keyframes`
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
`;

// Retrieve the styles for a particular nav item
const getNavItemSx = ({pageName, selectedPage}) => {
    let width = 5;
    const sx = {
        cursor: 'pointer',
        transition: 'width 1.00s linear, margin 1.00s linear',
        transform: 'scale(1.0)',
        //TODO: think this 'ml' means the nav items are off-center, should not apply to first item
        ml: 5,
        mb: 0,
    };

    if (pageName === 'listening') {
        width = 4;
        sx.pt = '0.25rem';
    }

    if (selectedPage !== pageName) {
        sx['&:hover:not(.selectedItem)'] = {
            animation: `${navPopEffect} 0.75s ease-in-out both`,
        };
    }
    else {
        width += 2;
        sx.mt = '-1rem';
    }
    sx.width = `${width}rem`;
     
    return sx;
};

// Initializes the Spotify Web Player.  Should only occur once per page load.
const initializeSpotifyPlayer = ({accessToken}) => {
    if (!accessToken) {
        return;
    }
    const player = new Spotify.Player({
      name: 'Web Playback SDK Quick Start Player',
      getOAuthToken: cb => { cb(accessToken); }
    });
    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

    // Ready
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
    //   webPlayer.transferPlayback({token: accessToken, device_id});
    });
  
    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });
  
    // Connect to the player!
    player.connect();

    return player;
}

const SpotifyAuthContext = React.createContext({access_token: null, refresh_token: null, device_id: null});
export {SpotifyAuthContext};

const SpotifyPlayerContext = React.createContext({expanded: false});
export {SpotifyPlayerContext};


const Layout = ({
    children,
    selectedPage,
}) => {
    const router = useRouter();
    // Leaving as an example of how to pass query params in case it's necessary later
    // const {previous} = router.query;
    const [transition, setTransition] = useState(true);
    const [spotifyPlayer, setSpotifyPlayer] = useState(null);
    const {access_token, device_id} = useContext(SpotifyAuthContext);
    // const {access_token, device_id} = useContext(SpotifyPlayerContext);
    useEffect(() => {
        setTransition(true);
    }, [selectedPage]);

    useEffect(() => {
        // The spotify web player SDK will call this function once the SDK has been initialized
        if (!window.onSpotifyWebPlaybackSDKReady) {
            window.onSpotifyWebPlaybackSDKReady = () => {
                const player = initializeSpotifyPlayer({accessToken: access_token});
                setSpotifyPlayer(player);
            }
        }
    }, [access_token]);

    const footerFadeDuration = transition ? 3000 : 50;

    // Click handler for nav items
    const handleActionClick = useCallback((nextPage, currentPage) => {
            setTransition(false);
            const navTimer = setTimeout(() => {
                // TODO - Previous is no longer used, currently keeping as an example
                router.push(`/${nextPage}?previous=${currentPage}`);
            }, fadeAnimationDuration);
            return () => clearTimeout(navTimer);
    }, []);

    // Create navItem list
    const nav = useMemo(() => (<Box sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '7rem',
        justifyContent: 'center',
        padding: '1rem 0',
    }}>
        {
            PAGE_NAMES.reduce((list, pageName) => {
                const navItemElem = (
                    <Box
                        key={pageName}
                        sx={getNavItemSx({pageName, selectedPage})}
                    >
                        <Image
                            onClick={e => handleActionClick(pageName, selectedPage)}
                            layout="responsive"
                            height={100}
                            width={100}
                            src={navImages[pageName]}
                        />
                    </Box>
                );

                list.push(navItemElem);
                return list;
            }, [])
        }
    </Box>), [selectedPage, handleActionClick]);

    const pageTitleActionText = useMemo(() => <Box>
                <span>
                    { PAGE_TO_TEXT[selectedPage] ? PAGE_TO_TEXT[selectedPage] + '?' : '...' }
                </span>
    </Box>, [selectedPage]);

    return (
        <Box>
            <Head>
                <title>TimConsuming</title>
            </Head>
            <Box sx={{minHeight: '90vh'}}>
                    <Box color="primary" sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        width: '100%',
                    }}>
                        <Box sx={{display: 'flex'}}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'flex-end'
                            }}>
                                <Typography className={styles.pageTitlePrefix} variant="h3">
                                    What is Tim
                                </Typography>
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                paddingLeft: '0.5em',
                            }}>
                                <Fade in={transition} timeout={fadeAnimationDuration}>
                                    <Typography className={styles.pageTitleSuffix} variant="h3">
                                        {pageTitleActionText}
                                    </Typography>
                                </Fade>
                            </Box>
                        </Box>
                    </Box>
                    {nav}
                    <Fade  in={transition} timeout={fadeAnimationDuration}>
                        <div>
                            {children}
                        </div>
                    </Fade>
            </Box>
            <Fade in={transition} timeout={footerFadeDuration}>
                <footer className={styles.footer}>
                    <Paper elevation={3} sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '3rem', 
                        width: '99%',
                    }}>
                        <Box>
                            <Typography variant="body2">
                                Nav Icons made by <Link sx={{color: 'white', fontWeight: 'bold'}} underline="hover" target="_blank" rel="noopener noreferrer" href="https://www.freepik.com" title="Freepik">Freepik</Link> from
                                &nbsp;<Link sx={{color: 'white', fontWeight: 'bold'}} underline="hover" target="_blank" rel="noopener noreferrer" href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</Link>
                            </Typography>
                        </Box>
                    </Paper>
                </footer>
            </Fade>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <SpotifyPlayer token={access_token} player={spotifyPlayer}></SpotifyPlayer>
            </Box>
        </Box>
    );
}

export default Layout;