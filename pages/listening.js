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
import spotifyData from './lib/spotify/data'
const login_url = '/api/spotify/login';

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

// Initializes the Spotify Web Player.  Should only occur once per page load.
const initializeSpotifyPlayer = ({accessToken}) => {
    const player = new Spotify.Player({
      name: 'Web Playback SDK Quick Start Player',
      getOAuthToken: cb => { cb(accessToken); }
    });
    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });
  
    // Playback status updates
    player.addListener('player_state_changed', state => { console.log(state); });
  
    // Ready
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
    });
  
    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });
  
    // Connect to the player!
    player.connect();
    return player;
  }


let spotify_player;
export default function Listening() {
    const [displayBackdrop, setDisplayBackdrop] = useState(false);
    const {access_token} = useContext(SpotifyAuthContext);
    const router = useRouter();
    // const topTracks = spotifyData.useTopTracks(access_token)
    const topTracks = useSWR(access_token ? [`https://api.spotify.com/v1/me/top/tracks`, access_token] : null, fetchWithToken)


    useEffect(() => {
        console.log("gonna set up this web player listener thing");
        // The spotify web player SDK will call this function once the SDK has been initialized
        window.onSpotifyWebPlaybackSDKReady = () => {
        console.log("Initializing player!");
          spotify_player = initializeSpotifyPlayer({accessToken: access_token});
        }
    }, []);

    let trackData = [],
        spotify_player_component = null;
    if (topTracks.data && topTracks.data.items) {
        trackData = topTracks.data.items;
        spotify_player_component = <SpotifyPlayer token={access_token} player={spotify_player}></SpotifyPlayer>;
        
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
        source: track.name,
        name: track.artists.map(artist => artist.name).join(", "),
        id: index,
        // location: "Asheville, NC",
        // description: "",
        // style: "Milkshake IPA",
        // imageScale: "0.5",
        imageUrl: track.album.images[0].url,
    }));

    const showBackdrop = (show) => {
        console.log("I am going to show a backdrop?", show);
        setDisplayBackdrop(show);
    }

    const spotifyLoginRedirect = () => {
      router.push(login_url);
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
            {/* <div className={styles.sectionContent}> */}
                <Button
                    // variant="contained"
                    variant="outlined"
                    size="large"
                    onClick={spotifyLoginRedirect}
                    classes={{root: styles.spotifyLoginButton, label: styles.spotifyLoginButtonLabel}}
                    startIcon={spotifyLogo}
                >
                    Login to Spotify
                </Button>
            {/* </div> */}
        </Paper>
    </Paper>;

    const loggedInContent = <div className={styles.listeningLoggedIn}>
        <Paper elevation={3} classes={{root: styles.sectionContainer}}>
            <Typography className={styles.sectionTitle} color="textSecondary" variant={'h5'}>Check out these hot tracks!</Typography>
            <div className={styles.sectionContent}>
                <Carousel items={trackItems} showBackdrop={showBackdrop} />
            </div>
        </Paper>
        <Paper elevation={3} classes={{root: styles.sectionContainer}}>
            {spotify_player_component}
        </Paper>
    </div>;

    return (
        <div className={styles.drinking}>
            { access_token ? loggedInContent : requiresLoginContent }
        </div>
    );
}