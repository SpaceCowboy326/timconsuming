import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image'

import Layout, {SpotifyAuthContext} from './components/layout';
import SpotifyPlayer from './components/spotify-player';
import Carousel from './components/carousel';
import { Button, Typography, Paper } from '@material-ui/core';
import styles from '../styles/listening.module.scss';
import React, { useState, useEffect, useContext } from 'react';
import spotifyData from './lib/spotify/data';
import WebPlayer from './lib/spotify/web-player';
const login_redirect_url = '/api/spotify/login';


import {PlayArrow, PlayCircleFilled, PlaylistAdd, QueuePlayNext} from '@material-ui/icons';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import useSWR from 'swr';

const fetchWithToken = (url, token) => {
    console.log('fetcher url?', url);
    console.log('fetcher token?', token);
    const options = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };

    return fetch(url, options).then(response => response.json());
    // return fetch(SPOTIFY_ENDPOINTS.SEARCH + "?" + search_query_params, options).then(respone => response.json())
};

// let spotify_player;
export default function Listening() {
    const [displayBackdrop, setDisplayBackdrop] = useState(false);
    const {access_token} = useContext(SpotifyAuthContext);
    const router = useRouter();
    // const topTracks = spotifyData.useTopTracks(access_token)
    const topTracks = useSWR(access_token ? [`https://api.spotify.com/v1/me/top/tracks`, access_token] : null, fetchWithToken)

    let trackData = [];
        // spotify_player_component = null;
    if (topTracks.data && topTracks.data.items) {
        trackData = topTracks.data.items;
    //     spotify_player_component = <SpotifyPlayer token={access_token} player={spotify_player}></SpotifyPlayer>;
        
    }
    // console.log('trackdata', trackData);
    const trackList = <ul>
             {trackData.map(track => <li className="doot">
                 <p>Artist: {track.artists.map(artist => artist.name)}</p>
                 <p>Album: {track.album.name}</p>
                 <p>Track: {track.name}</p>
             </li>)}
        </ul>;
    
    const trackItems = trackData.map((track, index) => ({
        source:     track.name,
        name:       track.artists.map(artist => artist.name).join(", "),
        id:         index,
        // location: "Asheville, NC",
        // description: "",
        // style: "Milkshake IPA",
        // imageScale: "0.5",
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
        const redirect_url_response = await fetch(login_redirect_url).then((res) => res.json());
        console.dir({redirect_url_response});
        router.push(redirect_url_response.redirect_url);
    };

    const spotifyLogo = <Image
        objectFit="cover"
        height={50}
        width={50}
        src={'/images/spotify-logo.png'}
    />;

    const requiresLoginContent = <Paper elevation={2} classes={{root: `${styles.requiresLoginPaperContainer}`}}>
        <Paper elevation={5} classes={{root: `${styles.requiresLoginPaper} ${styles.sectionContainer}`}}>
            <Typography className={`${styles.sectionTitle} ${styles.requiresLoginText}`} color="textSecondary" variant={'h5'}>Why look when you can listen?</Typography>
                <Button
                    variant="outlined"
                    size="large"
                    onClick={spotifyLoginRedirect}
                    classes={{root: styles.spotifyLoginButton, label: styles.spotifyLoginButtonLabel}}
                    startIcon={spotifyLogo}
                >
                    Login to Spotify
                </Button>
        </Paper>
    </Paper>;

    const loggedInContent = <div className={styles.listeningLoggedIn}>
        <Paper elevation={3} classes={{root: styles.sectionContainer}}>
            <Typography className={styles.sectionTitle} color="textSecondary" variant={'h5'}>Check out these hot tracks!</Typography>
            <div className={styles.sectionContent}>
                <Carousel items={trackItems} actions={actions} showBackdrop={showBackdrop} />
            </div>
        </Paper>
        {/* <Paper elevation={3} classes={{root: styles.playerContainer}}>
            {spotify_player_component}
        </Paper> */}
    </div>;

    return (
        <div className={styles.drinking}>
            { access_token ? loggedInContent : requiresLoginContent }
        </div>
    );
}