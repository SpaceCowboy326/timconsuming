import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Layout, {SpotifyAuthContext} from './components/layout'
import Carousel from './components/carousel';
import { Button, Typography, Paper } from '@material-ui/core';
import {items} from './data/drinking.json';
import styles from '../styles/drinking.module.scss';
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



export default function Listening() {
    const [displayBackdrop, setDisplayBackdrop] = useState(false);
    const {access_token} = useContext(SpotifyAuthContext);
    const router = useRouter();
    // const topTracks = spotifyData.useTopTracks(access_token)
    const topTracks = useSWR(access_token ? [`https://api.spotify.com/v1/me/top/tracks`, access_token] : null, fetchWithToken)
    
    // console.log("spotifyAuth", spotifyAuth)
    let trackData = [];
    console.log("topTracks is", topTracks);
    if (topTracks.data && topTracks.data.items) {
        trackData = topTracks.data.items
    }
    console.log('trackdata', trackData);
    const trackList = <ul>
            {trackData.map(track => <li className="doot">
                <p>Artist: {track.artists.map(artist => artist.name)}</p>
                <p>Album: {track.album.name}</p>
                <p>Track: {track.name}</p>
            </li>)}
        </ul>;
    
    console.log('tracklist', trackList);
    const showBackdrop = (show) => {
        console.log("I am going to show a backdrop?", show);
        setDisplayBackdrop(show);
    }

    const spotifyLoginRedirect = () => {
      router.push(login_url);
    };

    const requiresLoginContent = <Paper elevation={3} classes={{root: styles.sectionContainer}}>
        <Typography className={styles.sectionTitle} color="textSecondary" variant={'h5'}>I could tell you, but I'd rather show you.</Typography>
        <div className={styles.sectionContent}>
            <Button onClick={spotifyLoginRedirect}>Login</Button>
        </div>
    </Paper>;

    const loggedInContent = <Paper elevation={3} classes={{root: styles.sectionContainer}}>
            <Typography className={styles.sectionTitle} color="textSecondary" variant={'h5'}>Check out these hot tracks!</Typography>
            { trackList }
        </Paper>;

    return (
        <div className={styles.drinking}>
            { access_token ? loggedInContent : requiresLoginContent }
        </div>
    );
}