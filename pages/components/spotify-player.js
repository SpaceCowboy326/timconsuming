import React, { useContext, useEffect, useState } from 'react';
import WebPlayer from '../lib/spotify/web-player';
import { Box, IconButton, Paper, Slider, Typography } from '@mui/material';
import {PlayCircleFilled, PauseCircleFilled, SkipNext, SkipPrevious, ArrowDropDown } from '@mui/icons-material';
import { keyframes } from '@mui/system';

const flexCenterSx = {display: 'flex', justifyContent: 'center'};
const collapsedHeight = 2.5;
const textScrollEffect = keyframes`
    0% {
        transform: translateX(120%);
    }
    100% {
        transform: translateX(-100%);
    }
`;

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

    const openIconRotate = panelShown ? '0' : '180deg';
    const panelTranslate = panelShown ? '2px' : `calc(100% - ${collapsedHeight}em)`;

    return player ? <Paper elevation={5} sx={{
        border: '1px solid',
		borderColor: 'primary.dark',
        bottom: 0,
        padding: '0 0 .75em 0',
        position: 'fixed',
        transform: `translateY(${panelTranslate})`,
        transition: 'all 0.5s ease-in-out',
    }}>
        <Box sx={{
            display: 'flex',
            height: `${collapsedHeight}em`,
            width: '100%',
         }}>
            <IconButton onClick={togglePanelClick} sx={{
                      padding: 0,
                      position: 'absolute',
                      left: '50%',
                      top: 0,
                      transform: 'translateX(-50%)',
            }} size="large">
                <ArrowDropDown sx={{
                    fontSize: '3rem',
                    transform: `rotate(${openIconRotate})`,
                    transition: 'transform 0.5s',
                }}/>
            </IconButton>
        </Box>
        <Box sx={{width: '80vw'}}>
            <Box sx={flexCenterSx}>
                <Box sx={{mr: '1em', padding: '.25em'}}>
                    <IconButton
                        onClick={handlePreviousClick}
                        size={'small'}
                    >
                        <SkipPrevious sx={{fontSize: '4rem'}}/>
                    </IconButton>
                </Box>
                <Box sx={{padding: '.25em'}}>
                    <IconButton
                        onClick={togglePlaying}
                        size={'small'}
                    >
                        {
                            playing ?
                                <PauseCircleFilled sx={{fontSize: '4rem'}}/> :
                                <PlayCircleFilled sx={{fontSize: '4rem'}}/> 
                        }
                    </IconButton>
                </Box>
                <Box sx={{ml: '1em', padding: '.25em'}} >
                    <IconButton
                        onClick={handleNextClick}
                        size={'small'}
                    >
                        <SkipNext sx={{fontSize: '4rem'}}/>
                    </IconButton>
                </Box>
            </Box>
            <Box sx={{padding: '0 7em'}}>
                <Slider sx={{height: '10px'}} onChangeCommitted={handlePlaybackSliderChangeAccepted} onChange={handlePlaybackSliderChange} color="tertiary" value={position} size="large"></Slider>
            </Box>
            <Box sx={flexCenterSx}>
                <Box sx={{
                    alignItems: 'center',
                    borderRadius: '5px',
                    bgcolor: 'black',
                    border: '2px solid slategrey',
                    display: 'flex',
                    overflow: 'hidden',
                    padding: '.2em',
                    width: '90%',
                }}>
                    <Box sx={{
                        animation: `${textScrollEffect} 8s linear infinite`,
                        animationDelay: '2s',
                        whiteSpace: 'nowrap',
                        width: '80%',
                    }}>
                        <Typography sx={{color: 'lawngreen'}} variant={'h5'}>
                            {currentlyPlaying.text}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    </Paper> :
    null;
}

export default SpotifyPlayer;