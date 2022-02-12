import { useRouter } from 'next/router';
import Image from 'next/image'

import {SpotifyAuthContext} from './components/layout';
import Carousel from './components/carousel';
import { Button, CircularProgress, Typography, Paper } from '@mui/material';
import styles from '../styles/listening.module.scss';
import React, { useState, useContext, useMemo } from 'react';
import spotifyData from './lib/spotify/data';
import WebPlayer from './lib/spotify/web-player';
import {PlayArrow, PlayCircleFilled, PlaylistAdd, QueuePlayNext} from '@mui/icons-material';

import useSWR from 'swr';

const login_redirect_url = '/api/spotify/login';

const fetchWithToken = (url, token) => {
    console.log('fetcher url?', url);
    console.log('fetcher token?', token);
    const options = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };

    return fetch(url, options).then(response => response.json());
};

export default function Listening() {
    const [displayBackdrop, setDisplayBackdrop] = useState(false);
    const [redirecting, setRedirecting] = useState(false);
    const {access_token} = useContext(SpotifyAuthContext);
    const router = useRouter();
    // const topTracks = spotifyData.useTopTracks(access_token)
    const topTracks = useSWR(access_token ? [`https://api.spotify.com/v1/me/top/tracks`, access_token] : null, fetchWithToken);

    let trackData = [];
    if (topTracks.data && topTracks.data.items) {
        trackData = topTracks.data.items;
    }

    const trackList = <ul>
             {trackData.map((track, idx) => <li key={`track_${idx}`} className="doot">
                 <p>Artist: {track.artists.map(artist => artist.name)}</p>
                 <p>Album: {track.album.name}</p>
                 <p>Track: {track.name}</p>
             </li>)}
        </ul>;
    
    const trackItems = trackData.map((track, index) => ({
        source:     track.name,
        name:       track.artists.map(artist => artist.name).join(", "),
        id:         index,
        imageUrl:   track.album.images[0].url,
        uri:        track.uri,
    }));

    const playAction = {
        click: (data) => {
            console.log("playing...", data);
            WebPlayer.playTrack({
                token: access_token,
                track: data.uri,
            })
        },
        icon: <PlayCircleFilled className={styles.actionIcon}></PlayCircleFilled>,
        title: 'Play',
    };

    const queueAction = {
        click: (data) => {
            console.log("queueing...", data);
            WebPlayer.queueTrack({
                token: access_token,
                track: data.uri,
            })
        },
        icon: <QueuePlayNext className={styles.actionIcon}></QueuePlayNext>,
        title: 'Queue',
    };

    const addToPlaylist = {
        click: (data) => {
            console.log("playing...", data);
            WebPlayer.playTrack({
                token: access_token,
                track: data.uri,
            })
        },
        icon: <QueuePlayNext className={styles.actionIcon}></QueuePlayNext>,
        title: 'Play',
    };

    const actions = [playAction, queueAction];

    const showBackdrop = (show) => {
        console.log("I am going to show a backdrop?", show);
        setDisplayBackdrop(show);
    }

    const spotifyLoginRedirect = async () => {
        setRedirecting(true);
        // setTimeout(() => setRedirecting(false), 10000);
        // return;
        const redirect_url_response = await fetch(login_redirect_url).then((res) => res.json());
        console.dir({redirect_url_response});
        router.push(redirect_url_response.redirect_url);
    };

    const spotifyLogo = useMemo(() => <Image
        objectFit="cover"
        height={50}
        loading="eager"
        width={50}
        src={'/images/spotify-logo.png'}
    />, []);

    const redirectLoading = <CircularProgress color="secondary" size="50px" thickness={5} />;
    const sectionContainerSx = redirectLoading ? {background: '#20526b'} : null;

    const requiresLoginContent = !access_token ? <Paper elevation={2} sx={{bgcolor: 'primary.main'}} classes={{root: `${styles.requiresLoginPaperContainer}`}}>
        <Paper elevation={5} sx={sectionContainerSx} classes={{root: `${styles.requiresLoginPaper} ${styles.sectionContainer}`}}>
            <Typography color="white" variant={'h5'} sx={{mb: 3}}>
                Why look when you can listen?
            </Typography>
            <Button
                classes={{root: styles.spotifyLoginButton}}
                onClick={spotifyLoginRedirect}
                size="large"
                sx={{
                    color: 'white',
                    border: '1px solid white',
                    textDecorationColor: 'rgba(255, 255, 255, 0)',
                    transition: 'text-decoration-color 1250ms',
                    '&:hover': {
                        border: '1px solid white',
                        textDecorationColor: 'white',
                        textDecoration: 'underline',
                    }
                }}
                startIcon={redirecting ? redirectLoading : spotifyLogo}
                variant="outlined"
            >
                Login to Spotify
            </Button>
        </Paper>
    </Paper> : null;

    const loggedInContent = <div className={styles.listeningLoggedIn}>
        <Paper elevation={3} classes={{root: styles.sectionContainer}}>
            <Typography className={styles.sectionTitle} color="textSecondary" variant={'h5'}>Check out these hot tracks!</Typography>
            <div className={styles.sectionContent}>
                <Carousel type={'track'} items={trackItems} actions={actions} showBackdrop={showBackdrop} />
            </div>
        </Paper>
    </div>;

    return (
        <div className={styles.drinking}>
            { access_token ? loggedInContent : requiresLoginContent }
        </div>
    );
}