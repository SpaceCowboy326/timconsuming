import React, { useEffect, useState } from 'react';
import WebPlayer from '../lib/spotify/web-player';
import { Box, IconButton, Paper, Slider, Typography } from '@mui/material';
import {PlayCircleFilled, PauseCircleFilled, SkipNext, SkipPrevious, ArrowDropDown, VolumeDown, VolumeUp } from '@mui/icons-material';
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
const POSITION_INTERVAL = 200;
const DEFAULT_VOLUME = 50;
const playbackIconSize = 3;
const normalizePosition = ({max, value}) => ((value - MIN_POSITION) * 100) / (max - MIN_POSITION);

const millisecondsToMinutes = (milliseconds) => {
    if (!milliseconds) {
        return '0:00';
    }
    const totalSeconds = milliseconds / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const secondsText = (seconds < 10) ? '0' + seconds : seconds;
    return `${minutes}:${secondsText}`;
};
const estimateMillisecondPosition= ({duration, normalizedPosition}) => {
    // console.log("estimateMillisecondPosition", {normalizedPosition, duration});
    return ((normalizedPosition / 100) * duration);
};

function SpotifyPlayer({player, token}) {
    const [playing, setPlaying] = useState(false);
    const [currentlyPlaying, setCurrentlyPlaying] = useState({text: 'None'});
    const [position, setPosition] = useState(0);
    const [volume, setVolume] = useState(DEFAULT_VOLUME);
    // const {expanded, expand} = useContext(SpotifyPlayerContext);
    const [panelShown, setPanelShown] = useState(false);

    const togglePlaying = async () => {
        const nowPlaying = !playing;
        if (nowPlaying) {
            WebPlayer.play({token, device_id: player.device_id});
            const currentlyPlayingTrack = await WebPlayer.getCurrentlyPlaying({token, device_id: player.device_id});
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
        const normalizedPosition = normalizePosition({value: newPosition, max: duration});
        if (
            !position ||
            (Math.abs(position - normalizedPosition) >= POSITION_THRESHOLD)
        ) {
            setPosition(normalizedPosition);
        }
    };

    // While the track is playing, set an interval to update the track position slider.
    useEffect(() => {
        const duration = currentlyPlaying.duration;
        const startPosition = estimateMillisecondPosition({ duration, normalizedPosition: position });
        const offset = 0;
        let positionInterval;
        if (playing) {
            positionInterval = setInterval(() => {
            // console.log("interval running", offset);
                offset += POSITION_INTERVAL;
                const newPosition = startPosition + offset;
                updatePositionIfNecessary({newPosition, duration, currentPosition: position});
            }, POSITION_INTERVAL);
        }
        return () => clearInterval(positionInterval);
    }, [playing, position])

    // Toggle the panel collapsed state.
    const togglePanelClick = () => {
        setPanelShown(!panelShown);
    }

    const handlePlaybackSliderChange = (event, newValue) => {
        setPosition(newValue);
    }

    const handlePlaybackSliderChangeAccepted = (event, newValue) => {
        // console.log({currentlyPlaying})
        const millisecondPosition = estimateMillisecondPosition({duration: currentlyPlaying.duration, normalizedPosition: newValue});
        // WebPlayer.seek({position: millisecondPosition, token});
        player.seek(millisecondPosition);
    }

    const handleVolumeSliderChange = (event, newValue) => {
        setVolume(newValue);
        const playerVolume = newValue / 100;
        player.setVolume(playerVolume);
    }

    // Definitely debating the wisdom of only storing the calculated position.
    const positionMinutes = currentlyPlaying ? millisecondsToMinutes(
            estimateMillisecondPosition({
                duration: currentlyPlaying.duration,
                normalizedPosition: position
            })
        ) : null;
    const durationMinutes = currentlyPlaying ? millisecondsToMinutes(currentlyPlaying.duration) : null;

    // Attach a 'player_state_changed' listener to the Spotify Player. This event fires when almost any meaningful change
    // happens to the playback state, and will be sent periodically while a song is playing with progress updates.
    useEffect(() => {
        if (!player) {
            return;
        }
        player.addListener('player_state_changed', state => {
            // console.log("Player State Change", state);
            if (!state) {
                return;
            }
            const stateTrack = state?.track_window?.current_track;
            if(currentlyPlaying.id !== stateTrack.id) {
                const formattedTrackText = WebPlayer.currentlyPlayingToArtistAndTrack({item: stateTrack});
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
            if (state.paused) {
                setPlaying(false);
            }
            if (state.position && state.duration) {
                updatePositionIfNecessary({newPosition: state.position, duration: state.duration, currentPosition: position});
            }
        });
        return () => player.removeListener('player_state_changed');
    }, [player]);


    const handlePreviousClick = () => {
        WebPlayer.previous(token);
    };

    const handleNextClick = () => {
        WebPlayer.next(token);
    };

    const openIconRotate = panelShown ? '0' : '180deg';
    const panelTranslate = panelShown ? '2px' : `calc(100% - ${collapsedHeight}em)`;

    return player &&
    <Box sx={{display: 'flex', justifyContent: 'center'}}>
        <Paper elevation={5} sx={{
            border: '1px solid',
            borderColor: 'primary.dark',
            bottom: 0,
            minWidth: '15em',
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
                <IconButton onClick={togglePanelClick}
                    aria-label="Music Player Toggle Collapsed"
                    sx={{
                        padding: 0,
                        position: 'absolute',
                        left: '50%',
                        top: 0,
                        transform: 'translateX(-50%)',
                    }} size="large"
                >
                    <ArrowDropDown sx={{
                        fontSize: '3rem',
                        transform: `rotate(${openIconRotate})`,
                        transition: 'transform 0.5s',
                    }}/>
                </IconButton>
            </Box>
            <Box sx={{minWidth: '30em', width: '60vw'}}>
                <Box sx={{justifyContent: 'center', display: 'flex'}}>
                    <Box sx={{flex: '0 1 50%'}}></Box>
                    <Box sx={{display: 'flex'}}>
                        <Box sx={{mr: '1em', padding: '.25em'}}>
                            <IconButton
                                aria-label="Music Player Seek Backward"
                                onClick={handlePreviousClick}
                                size={'small'}
                            >
                                <SkipPrevious sx={{fontSize: `${playbackIconSize}em`}}/>
                            </IconButton>
                        </Box>
                        <Box sx={{padding: '.25em'}}>
                            <IconButton
                                aria-label="Music Player Toggle Play/Pause"
                                onClick={togglePlaying}
                                size={'small'}
                            >
                                {
                                    playing ?
                                        <PauseCircleFilled sx={{fontSize: `${playbackIconSize}em`}}/> :
                                        <PlayCircleFilled sx={{fontSize: `${playbackIconSize}em`}}/> 
                                }
                            </IconButton>
                        </Box>
                        <Box sx={{ml: '1em', padding: '.25em'}} >
                            <IconButton
                                aria-label="Music Player Seek Forward"
                                onClick={handleNextClick}
                                size={'small'}
                            >
                                <SkipNext sx={{fontSize: `${playbackIconSize}em`}}/>
                            </IconButton>
                        </Box>
                    </Box>
                    <Box sx={{flex: '0 1 50%'}}>
                        <Box sx={{alignItems: 'center', alignContent: 'center', display: 'flex', m: '1.25em 1.25em 0 1.25em', width: '10em'}}>
                            <VolumeDown/>
                            <Slider
                                color="tertiary"
                                onChange={handleVolumeSliderChange}
                                size="small"
                                sx={{height: '.25em', ml: '0', mr: '.3em'}}
                                value={volume}
                            ></Slider>
                            <VolumeUp/>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{display: 'flex', padding: '0 4em', alignItems: 'center'}}>
                    <Typography sx={{mt: '-.1em', mr: '1em'}}>{positionMinutes}</Typography>
                    <Slider
                        color="tertiary"
                        onChangeCommitted={handlePlaybackSliderChangeAccepted}
                        onChange={handlePlaybackSliderChange}
                        size="large"
                        sx={{height: '10px'}}
                        value={position}
                    ></Slider>
                    <Typography sx={{mt: '-.1em', ml: '1em'}}>{durationMinutes}</Typography>
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
        </Paper>
    </Box>;
}

export default SpotifyPlayer;