import Head from 'next/head'
import React, { useState } from 'react';
import { useRouter } from 'next/router';

import WebPlayer from '../lib/spotify/web-player';
// import TrackDisplay from './track-display';
// import PlaylistLib from '../lib/playlist';
import search from '../lib/spotify/search';

import { IconButton, Button, Typography, Paper } from '@material-ui/core';

const Playlist = PlaylistLib.Playlist;

// import { PlayCircleOutlined, PauseCircleOutlined, StepBackwardOutlined, StepForwardOutlined } from '@ant-design/icons';

// import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
// import SkipNextIcon from '@material-ui/icons/SkipNext';
import {PlayCircleFilled, PauseCircleFilled, SkipNext, SkipPrevious } from '@material-ui/icons';


function SpotifyPlayer({player, playlist, token}) {
    const [playing, setPlaying] = useState(false);
    // const [currentSong, setCurrentSong] = useState(playlist.getNextSong());
    // should be an ArtistData object.
    const [currentArtistData, setCurrentArtistData] = useState(playlist.getNextArtist());
    // const { artist_search_data, is_loading, is_error } = search.useArtistSearch(currentArtistData.requiresFetch() ? currentArtistData : null, token);
    // if ( !is_loading && artist_search_data ) {
    //     console.log("Artist Search Data is", artist_search_data);
    //     track.artist_info
    // }
console.log("My artistData looks like this", currentArtistData);
    if (artist_search_data && !currentArtistData.spotifyData) {
        currentArtistData.spotifyData = artist_search_data;
    }
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
        {/* <Row justify="space-around" align="middle">
            <TrackDisplay track={current_track}></TrackDisplay>
        </Row> */}
        <Row justify="space-around" align="middle">
            <Col>
                <Button type="primary" shape="circle" onClick={handlePreviousClick} icon={<SkipPrevious />} />
            </Col>
            <Col>
                <Button type="primary" onClick={togglePlaying} shape="circle" icon={ playing ? <PlayCircleFilled /> : <PauseCircleFilled /> } />
            </Col>
            <Col>
                <Button type="primary" shape="circle" onClick={handleNextClick} icon={<SkipNext />} />
            </Col>
        </Row>
    </div>

}



export default SpotifyPlayer;