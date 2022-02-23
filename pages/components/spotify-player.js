import React, { useContext, useEffect, useState } from 'react';
import WebPlayer from '../lib/spotify/web-player';
import styles from '../../styles/spotifyPlayer.module.scss';
import { Box, IconButton, Paper, Slider, Typography } from '@mui/material';
import {PlayCircleFilled, PauseCircleFilled, SkipNext, SkipPrevious, ArrowDropDown } from '@mui/icons-material';

const MIN_POSITION = 1;
const POSITION_THRESHOLD = .5;
const POSITION_INTERVAL = 1000;
const normalizePosition = ({max, value}) => ((value - MIN_POSITION) * 100) / (max - MIN_POSITION);

const estimateMillisecondPosition= ({duration, normalizedPosition}) => {
    // console.log("estimateMillisecondPosition", {normalizedPosition, duration});
    return ((normalizedPosition / 100) * duration);
};

function SpotifyPlayer({player, token}) {
    const [playing, setPlaying] = useState(false);
    const [currentlyPlaying, setCurrentlyPlaying] = useState({text: 'None'});
    const [position, setPosition] = useState(0);
    const [listening, setListening] = useState(false);
    // const {expanded, expand} = useContext(SpotifyPlayerContext);
    const [panelShown, setPanelShown] = useState(false);

    console.log("SpotifyPlayer Position", position);
    const togglePlaying = async () => {
        const nowPlaying = !playing;
        if (nowPlaying) {
            WebPlayer.play(token);
            const currentlyPlayingTrack = await WebPlayer.getCurrentlyPlaying(token);
            // console.log({currentlyPlayingTrack});
            const formattedTrackText = WebPlayer.currentlyPlayingToArtistAndTrack({item: currentlyPlayingTrack});
            if (currentlyPlayingTrack.item.id !== currentlyPlaying.id) {
                // console.log("setting currently playing...");
                setCurrentlyPlaying({
                    duration: currentlyPlayingTrack.item.duration_ms,
                    id: currentlyPlayingTrack.item.id,
                    // position: currentlyPlayingTrack.progress_ms || 0,
                    text: formattedTrackText,
                });
            }
        }
        else {
            WebPlayer.pause(token);
        }
        setPlaying(nowPlaying);
    };

    // Updates the position of the playback bar if the provided value is a large enough increment to warrant
    // a re-render
    const updatePositionIfNecessary = ({newPosition, duration, currentPosition}) => {
        // console.log({newPosition, duration});
        const normalizedPosition = normalizePosition({value: newPosition, max: duration});
        // console.log("new normalized position", normalizedPosition);
        // console.log("state position", position);
        if (
            !position ||
            (Math.abs(position - normalizedPosition) >= POSITION_THRESHOLD)
        ) {
            setPosition(normalizedPosition);
        }
    };

    // If the 
    useEffect(() => {
        if (playing) {
            const duration = currentlyPlaying.duration;
            const startPosition = estimateMillisecondPosition({ duration, normalizedPosition: position });
            const offset = 0;
            let positionInterval = setInterval(() => {
                offset += POSITION_INTERVAL;
                const newPosition = startPosition + offset;
                updatePositionIfNecessary({newPosition, duration: duration, currentPosition: position});
            }, POSITION_INTERVAL);
            return () => clearInterval(positionInterval);
        }
    }, [playing, position])

    // Toggle the panel collapsed state.
    const togglePanelClick = () => {
        setPanelShown(!panelShown);
    }

    // const handlePlaybackSliderChange = (value) => {
    //     const millisecondPosition = estimateMillisecondPosition({duration: currentlyPlaying.duration, normalizedPosition: position});
    //     console.log("Trying to set position to:", millisecondPosition);
    //     WebPlayer.seek({position: millisecondPosition, token});
    // };

    const handlePlaybackSliderChange = (event, newValue) => {
        console.log("Slider Change", {newValue, event});
        setPosition(newValue);
    }

    const handlePlaybackSliderChangeAccepted = (event, newValue) => {
        console.log({currentlyPlaying})
        const millisecondPosition = estimateMillisecondPosition({duration: currentlyPlaying.duration, normalizedPosition: newValue});
        WebPlayer.seek({position: millisecondPosition, token});
    }

    const spotifyPanelClasses = panelShown ?
        {root: `${styles.spotifyPlayerPanel} ${styles.spotifyPlayerPanel__shown}`} :
        {root: styles.spotifyPlayerPanel};

    // Attach a 'player_state_changed' listener to the Spotify Player. This event fires when almost any meaningful change
    // happens to the playback state, and will be sent periodically while a song is playing with progress updates.
    useEffect(() => {
        // if (player && !listening) {
        if (player) {
            player.addListener('player_state_changed', state => {
                console.log("Player State Change", state);
                if (!state) {
                    return;
                }
                const stateTrack = state?.track_window?.current_track;
                const formattedTrackText = WebPlayer.currentlyPlayingToArtistAndTrack({item: stateTrack});
                if(currentlyPlaying.id !== stateTrack.id) {
                    setCurrentlyPlaying({
                        duration: stateTrack.duration || stateTrack.duration_ms,
                        id: stateTrack.id,
                        text: formattedTrackText,
                    });
                };
                if (!state.paused && !playing && stateTrack) {
                    setPlaying(true);
                    setPanelShown(true);
                }
                if (state.position && state.duration) {
                    updatePositionIfNecessary({newPosition: state.position, duration: state.duration, currentPosition: position});
                }
            });
            // setListening(true);
            return () => player.removeListener('player_state_changed');
        }
    }, [player]);


    const handlePreviousClick = () => {
        WebPlayer.previous(token);
    };

    const handleNextClick = () => {
        WebPlayer.next(token);
    };

    return player ? <Paper elevation={5} classes={spotifyPanelClasses}>
        <Box className={styles.handle}>
            <IconButton onClick={togglePanelClick} className={styles.openButton} size="large">
                <ArrowDropDown className={styles.openIcon}/>
            </IconButton>
        </Box>
        <Box className={styles.spotifyPlayer}>
            <Box className={styles.playbackButtons}>
                <Box className={styles.previousButton}>
                    <IconButton
                        onClick={handlePreviousClick}
                        size={'small'}
                        // className={styles.previousButton}
                        // classes={{root: styles.previousButton}}
                    >
                        <SkipPrevious className={styles.playerIcon}/>
                    </IconButton>
                </Box>
                <Box className={styles.pausePlayButton}>
                    <IconButton
                        onClick={togglePlaying}
                        size={'small'}
                        // className={styles.pausePlayButton}
                        // classes={{root: styles.pausePlayButton}}
                    >
                        {
                            playing ?
                                <PauseCircleFilled className={styles.playerIcon}/> :
                                <PlayCircleFilled className={styles.playerIcon}/> 
                        }
                    </IconButton>
                </Box>
                <Box className={styles.nextButton} >
                    <IconButton
                        onClick={handleNextClick}
                        size={'small'}
                        // className={styles.nextButton}
                        // classes={{root: styles.nextButton}}
                    >
                        <SkipNext className={styles.playerIcon}/>
                    </IconButton>
                </Box>
            </Box>
            <Box className={styles.playback}>
                <Slider sx={{height: '10px'}} onChangeCommitted={handlePlaybackSliderChangeAccepted} onChange={handlePlaybackSliderChange} color="tertiary" value={position} size="large"></Slider>
            </Box>
            <Box className={styles.currentlyPlayingContainer}>
                <Box className={styles.scrollContainer}>
                <Typography classes={{root: styles.currentlyPlayingText}} color="textPrimary" variant={'h5'}>
                    {currentlyPlaying.text}
                </Typography>
                </Box>
            </Box>
        </Box>
    </Paper> :
    null;
}

export default SpotifyPlayer;