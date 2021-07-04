import Head from 'next/head'
import React, { useState } from 'react';
import { useRouter } from 'next/router';

import WebPlayer from '../lib/spotify/web-player';
// import TrackDisplay from './track-display';
// import PlaylistLib from '../lib/playlist';
import search from '../lib/spotify/search';

import { IconButton, Button, Typography, Paper, Grid } from '@material-ui/core';


// import { PlayCircleOutlined, PauseCircleOutlined, StepBackwardOutlined, StepForwardOutlined } from '@ant-design/icons';

// import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
// import SkipNextIcon from '@material-ui/icons/SkipNext';
import {PlayCircleFilled, PauseCircleFilled, SkipNext, SkipPrevious } from '@material-ui/icons';


function SpotifyPlayer({player, playlist, token}) {
    const [playing, setPlaying] = useState(false);
    const current_track = null;
    const togglePlaying = () => {
        setPlaying(!playing);
        if (playing) {
            WebPlayer.play(token);
        }
        else {
            WebPlayer.pause(token);
        }
    };

    const handlePreviousClick = () => {
        WebPlayer.previous(token);
    };

    const handleNextClick = () => {
        WebPlayer.next(token);
    };

    return <div>
        <Grid container spacing={3}>
            <Grid item xs>
                <IconButton onClick={handlePreviousClick}>
                    <SkipPrevious/>
                </IconButton>
            </Grid>
            <Grid item xs>
                <IconButton onClick={togglePlaying}>
                    {playing ? <PlayCircleFilled/> : <PauseCircleFilled/>}
                </IconButton>
            </Grid>
            <Grid item xs>
                <IconButton onClick={handleNextClick}>
                    <SkipNext/>
                </IconButton>
            </Grid>
        </Grid>
    </div>

}



export default SpotifyPlayer;