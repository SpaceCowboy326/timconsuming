import Head from 'next/head'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import WebPlayer from '../lib/spotify/web-player';
// import TrackDisplay from './track-display';
// import PlaylistLib from '../lib/playlist';
import search from '../lib/spotify/search';
import styles from '../../styles/spotifyPlayer.module.scss';
//TODO fix
// const styles = {};


import { IconButton, Button, Typography, Paper, Grid } from '@material-ui/core';


// import { PlayCircleOutlined, PauseCircleOutlined, StepBackwardOutlined, StepForwardOutlined } from '@ant-design/icons';

// import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
// import SkipNextIcon from '@material-ui/icons/SkipNext';
import {PlayCircleFilled, PauseCircleFilled, SkipNext, SkipPrevious } from '@material-ui/icons';


function SpotifyPlayer({player, playlist, token}) {
    const [playing, setPlaying] = useState(false);
    const [currentlyPlaying, setCurrentlyPlaying] = useState('None');
    
    const current_track = null;
    const togglePlaying = async () => {
        setPlaying(!playing);
        if (playing) {
            WebPlayer.play(token);
            const formattedCurrentlyPlaying = await WebPlayer.getCurrentlyPlaying(token);
            // const currentlyPlayingText = WebPlayer.currentlyPlayingToArtistAndTrack(currentlyPlayingData)
            setCurrentlyPlaying(formattedCurrentlyPlaying);
            // setCurrentlyPlaying(currently_playing);
        }
        else {
            WebPlayer.pause(token);
        }
    };

    useEffect(() => {
        if (player) {
            player.addListener('player_state_changed', state => {
                console.log("player state change", state);
                const stateTrack = state?.track_window?.current_track;
                if (state && !state.paused && stateTrack) {
                    const formattedCurrentlyPlaying = WebPlayer.currentlyPlayingToArtistAndTrack({item: stateTrack});
                    setPlaying(true);
                    setCurrentlyPlaying(formattedCurrentlyPlaying);
                }
            });
        }
    }, [player]);

    

    const handlePreviousClick = () => {
        WebPlayer.previous(token);
    };

    const handleNextClick = () => {
        WebPlayer.next(token);
    };

    return <div className={styles.spotifyPlayer}>
        <IconButton
            onClick={handlePreviousClick}
            className={styles.previousButton}
            
        >
            <SkipPrevious className={styles.playerIcon}/>
        </IconButton>
        <IconButton
            onClick={togglePlaying}
            className={styles.pausePlayButton}
            // classes={styles.playerIcon}
        >
            {
                playing ?
                    <PlayCircleFilled className={styles.playerIcon}/> :
                    <PauseCircleFilled className={styles.playerIcon}/>
            }
        </IconButton>
        <IconButton
            onClick={handleNextClick}
            className={styles.nextButton}
            // classes={{root: styles.playerIcon}}
        >
            <SkipNext className={styles.playerIcon}/>
        </IconButton>
        <div className={styles.currentlyPlayingContainer}>
            <div className={styles.scrollContainer}>
            <Typography classes={{root: styles.currentlyPlayingText}} color="textPrimary" variant={'h5'}>
                {currentlyPlaying}
            </Typography>
            </div>
        </div>
    </div>

}



export default SpotifyPlayer;