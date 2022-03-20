import { useRouter } from 'next/router';
import Image from 'next/image'

import {SpotifyAuthContext} from '../components/layout/layout';
import { Box, Button, CircularProgress, Typography, Paper } from '@mui/material';
import React, { useState, useContext, useCallback, useMemo, useEffect } from 'react';
import spotifyData from '../lib/spotify/data';
import WebPlayer from '../lib/spotify/web-player';
import { Favorite, HeartBroken, PlayCircleFilled, PlaylistAdd, QueuePlayNext } from '@mui/icons-material';


import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import TypeDisplay from '../components/typeDisplay';

import { useQuery } from 'react-query'
 
const login_redirect_url = '/api/spotify/login';

const actionIconSx = {
    fontSize: '4.5rem',
}

const requiresLoginPaperSx = {
    alignItems: 'center',
    display: 'flex',
    height: '28em',
    justifyContent: 'center',
    mb: '3em',
    width: '98vw',
};

const fetchWithToken = (url, token) => {
    // console.log('fetcher url?', url);
    // console.log('fetcher token?', token);
    const options = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };

    return fetch(url, options);
};

// Converts Spotify track data into a format item.js can display.
const trackToItem = (track) => ({
    album:      track.album.name,
    source:     track.artists.map(artist => artist.name).join(", "),
    name:       track.name,
    id:         track.id,
    _id:         track.id,
    imageUrl:   track.album.images[0].url,
    uri:        track.uri,
});

export default function Listening() {
    const [redirecting, setRedirecting] = useState(false);
    const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
    const {accessToken, refreshToken} = useContext(SpotifyAuthContext);
    const [playlistMenuAnchorEl, setPlaylistMenuAnchorEl] = useState(null);
    const router = useRouter();

    const { isLoading: topTracksLoading, error: topTracksError, data: topTracks } = useQuery(['topTracks', accessToken], ({queryKey}) => {
        return fetchWithToken(`https://api.spotify.com/v1/me/top/tracks`, queryKey[1]).then(res => res.json());
    },
    {
        enabled: !!accessToken,
        staleTime: 300,
    });

    useEffect(() => console.log("!!!Access token is changing!!!"), [accessToken]);
    const { isLoading: userPlaylistsLoading, error: userPlaylistsError, data: userPlaylists } =
        useQuery(
            ['userPlaylists', accessToken],
            ({queryKey}) => spotifyData.getUserPlaylists(queryKey[1]),
            {
                enabled: !!accessToken,
                staleTime: 300,
            }
        );

    useEffect(() => console.log("!!!userPlaylists token is changing!!!"), [userPlaylists]);

    // User selected a playlist - add the track and close the menu.
    const handlePlaylistClick = useCallback((playlistId) => {
        // console.log("Adding song to playlist", playlistId);
        setShowPlaylistMenu(false);
    }, []);

    // playlistMenu is displayed whenver a user clicks on the "add to playlist" button in the expanded item view.
    const playlistMenu = useMemo(() =>
        <Menu
            anchorEl={playlistMenuAnchorEl}
            open={showPlaylistMenu}
            MenuListProps={{sx: {bgcolor: 'background.default'}}}
            onClose={() => setShowPlaylistMenu(false)}
        >
            {userPlaylists?.items?.map(playlist =>
                <MenuItem
                    onClick={() => handlePlaylistClick(playlist.id)}
                    key={`playlist_${playlist.id}`}
                >{playlist.name}
                </MenuItem>
            )}
        </Menu>,
        [userPlaylists, showPlaylistMenu]
    );
    const trackItems = useMemo(() => topTracks?.items?.map(trackToItem), [topTracks]);
 
    const actionsByName = useMemo(() => {
        return {
            play: {
                click: ({data, e}) => {
                    // console.log("playing...", data);
                    WebPlayer.playTrack({
                        token: accessToken,
                        track: data.uri,
                    });
                },
                icon: <PlayCircleFilled sx={actionIconSx}></PlayCircleFilled>,
                title: 'Play',
            },
            queue: {
                click: ({data, e}) => {
                    // console.log("queueing...", data);
                    WebPlayer.queueTrack({
                        token: accessToken,
                        track: data.uri,
                    })
                },
                icon: <QueuePlayNext sx={actionIconSx}></QueuePlayNext>,
                title: 'Queue',
            },
            addToPlaylist: {
                click: ({data, e}) => {
                    setPlaylistMenuAnchorEl(e.currentTarget);
                    setShowPlaylistMenu(true);
                },
                icon: <PlaylistAdd sx={actionIconSx}/>,
                title: 'Add to Playlist',
            },
            saveTrack: {
                click: ({data, e}) => {
                    // console.log("saveTrack data", data);
                    WebPlayer.saveTrack({
                        accessToken,
                        id: data.id,
                    });
                },
                icon: <Favorite sx={actionIconSx}/>,
                title: 'Save Track',
            }
        }
    }, [accessToken, setPlaylistMenuAnchorEl, setShowPlaylistMenu]);

    const actions = useMemo(() => Object.values(actionsByName), [actionsByName]);

    const spotifyLoginRedirect = useCallback(async () => {
        setRedirecting(true);
        const redirect_url_response = await fetch(`${login_redirect_url}`).then((res) => res.json());
        router.push(redirect_url_response.redirect_url);
    }, [router]);

    const spotifyLogo = useMemo(() => <Image
        objectFit="cover"
        height={50}
        loading="eager"
        width={50}
        src={'/images/spotify-logo.png'}
    />, []);

    const redirectLoading = <CircularProgress color="secondary" size="50px" thickness={5} />;
    const sectionContainerSx = {
        alignItems: 'center',
        display: 'flex',
        flexFlow: 'column',
        height: '16rem',
        justifyContent: 'center',
        mt: '2em',
        width: '40em',
    };

    const requiresLoginContent = useMemo(() => {
        return !accessToken ?
            <Paper elevation={2} sx={requiresLoginPaperSx}>
                <Paper elevation={5} sx={sectionContainerSx}>
                    <Typography color="white" variant={'h5'} sx={{mb: 3}}>
                        Why look when you can listen?
                    </Typography>
                    <Button
                        onClick={spotifyLoginRedirect}
                        size="large"
                        sx={{
                            color: 'white',
                            border: '1px solid white',
                            textDecorationColor: 'rgba(255, 255, 255, 0)',
                            transition: 'text-decoration-color 1250ms',
                            '&:hover': {
                                border: '1px solid white',
                                textDecorationColor: 'white',
                                textDecoration: 'underline',
                            },
                            width: '23rem',
                        }}
                        startIcon={redirecting ? redirectLoading : spotifyLogo}
                        variant="outlined"
                    >
                        Login to Spotify
                    </Button>
                </Paper>
            </Paper> :
            null
    }, [accessToken, redirecting]);

    const loggedInContent = useMemo(() =>
        <div>
            {playlistMenu}
            <TypeDisplay type="Music" data={trackItems} actions={actions}/>
        </div>,
        [trackItems, actions]
    );

    const loadingTracksDisplay = <Box sx={{width: '100%', display: 'flex', justifyContent: 'center'}}>
        <CircularProgress color="secondary" thickness={3} size={100} sx={{mt: 10}}></CircularProgress>;
    </Box>;

    return (
        <div>
            { (!accessToken && refreshToken) ? loadingTracksDisplay : null }
            { (!accessToken && !refreshToken) ? requiresLoginContent : null }
            { trackItems?.length ? loggedInContent : null}
        </div>
    );
}