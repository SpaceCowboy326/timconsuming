import React, { useEffect, useState } from 'react';
import WebPlayer from '../lib/spotify/web-player';
import styles from '../../styles/spotifyPlayer.module.scss';
import { IconButton, Typography, Paper } from '@material-ui/core';
import {PlayCircleFilled, PauseCircleFilled, SkipNext, SkipPrevious, ArrowDropDown } from '@material-ui/icons';


function SpotifyPlayer({player, token}) {
    const [playing, setPlaying] = useState(false);
    const [currentlyPlaying, setCurrentlyPlaying] = useState('None');
    const [listening, setListening] = useState(false);
    const {expanded, expand} = useContext(SpotifyPlayerContext);
    const [panelShown, setPanelShown] = useState(expanded);

    const togglePlaying = async () => {
        const nowPlaying = !playing;
        if (nowPlaying) {
            WebPlayer.play(token);
            const formattedCurrentlyPlaying = await WebPlayer.getCurrentlyPlaying(token);
            setCurrentlyPlaying(formattedCurrentlyPlaying);
        }
        else {
            WebPlayer.pause(token);
        }
        setPlaying(nowPlaying);
    };

    useEffect(() => {
        setPanelShown(true);
    }, [expanded]);

    // Toggle the panel collapsed state.
    const togglePanelClick = () => {
        setPanelShown(!panelShown);
    }

    const spotifyPanelClasses = panelShown ?
        {root: `${styles.spotifyPlayerPanel} ${styles.spotifyPlayerPanel__shown}`} :
        {root: styles.spotifyPlayerPanel};

    useEffect(() => {
        if (player && !listening) {
            player.addListener('player_state_changed', state => {
                console.log({state});
                if (!state) {
                    return;
                }
                const stateTrack = state?.track_window?.current_track;
                if (state && !state.paused && stateTrack) {
                    const formattedCurrentlyPlaying = WebPlayer.currentlyPlayingToArtistAndTrack({item: stateTrack});
                    console.log("We def playing.");
                    setPlaying(true);
                    setCurrentlyPlaying(formattedCurrentlyPlaying);
                }
            });
            setListening(true);
        }
    }, [player]);


    const handlePreviousClick = () => {
        WebPlayer.previous(token);
    };

    const handleNextClick = () => {
        WebPlayer.next(token);
    };

    return player ? <Paper elevation={5} classes={spotifyPanelClasses}>
        <IconButton
            onClick={togglePanelClick}
            className={styles.openButton}
        >
            <ArrowDropDown className={styles.openIcon}/>
        </IconButton>
        <div className={styles.spotifyPlayer}>
            <IconButton
                onClick={handlePreviousClick}
                className={styles.previousButton}
            >
                <SkipPrevious className={styles.playerIcon}/>
            </IconButton>
            <IconButton
                onClick={togglePlaying}
                className={styles.pausePlayButton}
            >
                {
                    playing ?
                        <PauseCircleFilled className={styles.playerIcon}/> :
                        <PlayCircleFilled className={styles.playerIcon}/> 
                }
            </IconButton>
            <IconButton
                onClick={handleNextClick}
                className={styles.nextButton}
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
    </Paper> :
    null;
}

export default SpotifyPlayer;