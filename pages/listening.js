import { useRouter } from 'next/router';
import Image from 'next/image'

import {SpotifyAuthContext} from '../components/layout/layout';
import { Box, Button, CircularProgress, Typography, Paper } from '@mui/material';
import React, { useState, useContext, useCallback, useMemo } from 'react';
import WebPlayer from '../lib/spotify/web-player';
import { Favorite, HeartBroken, PlayCircleFilled, PlaylistAdd, QueuePlayNext } from '@mui/icons-material';


import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import TypeDisplay from '../components/typeDisplay';

import { useQuery, useQueries } from 'react-query'

const redirectLoading = <CircularProgress color="secondary" size="50px" thickness={5} />;

const INITIAL_PLAYLIST_COUNT = 3;
const login_redirect_url = '/api/spotify/login';

const actionIconSx = {
    fontSize: '4rem',
}

const requiresLoginPaperSx = {
    alignItems: 'center',
    display: 'flex',
    height: '28em',
    justifyContent: 'center',
    mb: '3em',
    width: '98vw',
};

const sectionContainerSx = {
    alignItems: 'center',
    display: 'flex',
    flexFlow: 'column',
    height: '16rem',
    justifyContent: 'center',
    mt: '2em',
    width: '40em',
};

const spotifyLogo = <Image
    alt="Spotify Logo"
    objectFit="cover"
    height={50}
    loading="eager"
    width={50}
    src={'/images/spotify-logo.png'}
/>;

const playlistOptions = [
    '0viZpIBjNkJj9OMIEcAtqQ', // I Mean, I Wish I Didn't Like It
    '44eQFIoHZdzCEozLZEZ05I', // Hippity Hop
    '23ZzYbc3qJ1N9rNUh58ffO', // Classic Rock. Mostly.
    '5S6DGkWYNO1KtpBkcWl03I', // Indie
    '2bnwRsoVKlSFcR3Hsno6Pq', // Punk, Pop Punk, Emo, I dunno
    '6EnRitQJrAGCyAJVEih1zW', // That's so 90's
];

const pickNPlaylists = ({n, picked = []}) => {
    const remainingPlaylists = playlistOptions.filter(playlist => picked.indexOf(playlist) === -1);
    while (picked.length < n && remainingPlaylists.length) {
        const nextIndex = Math.floor(Math.random() * (remainingPlaylists.length - 1));
        picked.push(remainingPlaylists[nextIndex]);
        remainingPlaylists.splice(nextIndex, 1);
    };
    return picked;
}

// Converts Spotify track data into a format item.js can display.
const trackToItem = ({track, playlist, playlistId}) => ({
    album:      track.album.name,
    source:     track.artists.map(artist => artist.name).join(", "),
    sourceUrl:  track.artists[0].external_urls.spotify,
    name:       track.name,
    nameUrl:    track.external_urls.spotify,
    id:         track.id,
    _id:        track.id,
    imageUrl:   track.album.images[0].url,
    uri:        track.uri,
    tags:       [playlist],
    playlistId: [playlistId],
});

export default function Listening({initialPlaylists}) {
    const [redirecting, setRedirecting] = useState(false);
    const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
    const {accessToken, refreshToken} = useContext(SpotifyAuthContext);
    const [playlistMenuAnchorEl, setPlaylistMenuAnchorEl] = useState(null);

    const [selectedPlaylists, setSelectedPlaylists] = useState(initialPlaylists || []);
    const router = useRouter();

    const playlistQueries = useMemo(() => {
        if (!accessToken || !selectedPlaylists) {
            return [];
        }
        return selectedPlaylists.map(playlistId => {
            return {
                queryKey: ['playlist', playlistId],
                queryFn: ({queryKey}) => {return WebPlayer.getPlaylist({playlistId: queryKey[1], token: accessToken})},
                staleTime: 800,
                refetchOnWindowFocus: false,
            }
        });
    }, [selectedPlaylists, accessToken]);
    const playlistQueryResults = useQueries(playlistQueries);

    const playlistItems = useMemo(() => {
        return playlistQueryResults
            .filter(playlistResponse => playlistResponse.isSuccess)
            .reduce((items, playlistResponse) => {
                const playlist = playlistResponse.data;
                const playlistTracks = playlist ?
                    playlist?.tracks?.items.map((playlistItem) => trackToItem({track: playlistItem.track, playlist: playlist.name, playlistId: playlist.id})) :
                    [];
                return items.concat(playlistTracks);
            }, []);
    }, [playlistQueryResults]);

    const playlistIdToName = useMemo(() => {
        return playlistQueryResults.reduce((idToName, playlistResponse) => {
            const name = playlistResponse?.data?.name;
            const id = playlistResponse?.data?.id;
            if (name) {
                idToName[ id ] = name;
            }
            return idToName;
        }, {});
    }, [playlistQueryResults]);

    const selectedPlaylistNames = useMemo(() => {
        return selectedPlaylists.reduce((names, playlistId) => {
            const playlistName = playlistIdToName[playlistId];
            if (playlistName) {
                names.push(playlistName);
            }
            return names;
        }, [])
    }, [playlistIdToName, selectedPlaylists]);

    const addPlaylist = useCallback(() => {
        const newSelectedPlaylists = pickNPlaylists({n: selectedPlaylists.length + 1, picked: [...selectedPlaylists]});
        setSelectedPlaylists(newSelectedPlaylists);
    }, [selectedPlaylists, setSelectedPlaylists]);

    const removePlaylist = useCallback((playlistName) => {
        const playlistId = Object.keys(playlistIdToName).find((id) => playlistIdToName[id] === playlistName);
        const newSelectedPlaylists = [...selectedPlaylists];
        const playlistIndex = newSelectedPlaylists.indexOf(playlistId);
        newSelectedPlaylists.splice(playlistIndex, 1);

        setSelectedPlaylists(newSelectedPlaylists);
    }, [setSelectedPlaylists, playlistIdToName, selectedPlaylists])

    const { isLoading: userPlaylistsLoading, error: userPlaylistsError, data: userPlaylists } =
        useQuery(
            ['userPlaylists', accessToken],
            ({queryKey}) => WebPlayer.getUserPlaylists(queryKey[1]),
            {
                enabled: !!accessToken,
                staleTime: 300,
            }
        );

    // User selected a playlist - add the track and close the menu.
    const handlePlaylistClick = useCallback((playlistId) => {
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
        [userPlaylists, showPlaylistMenu, playlistMenuAnchorEl, handlePlaylistClick]
    );

    const actionsByName = useMemo(() => {
        return {
            play: {
                click: ({data, e}) => {
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

    const requiresLoginContent = useMemo(() => {
        return !accessToken ?
            <Paper elevation={2} sx={requiresLoginPaperSx}>
                <Paper elevation={5} sx={{...sectionContainerSx, bgcolor: '#363636'}}>
                    <Typography color="white" variant={'h5'} sx={{mb: 3}}>
                        Why look when you can listen?
                    </Typography>
                    <Button
                        onClick={spotifyLoginRedirect}
                        size="large"
                        sx={{
                            bgcolor: '#222324',
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
    }, [accessToken, redirecting, spotifyLoginRedirect]);

    const loggedInContent = useMemo(() =>
        <div>
            {playlistMenu}
            <TypeDisplay
                actions={actions}
                addCategory={addPlaylist}
                data={playlistItems}
                externalCategories={selectedPlaylistNames}
                removeCategory={removePlaylist}
                type="Music"
            />
        </div>,
        [playlistItems, actions, addPlaylist, removePlaylist, selectedPlaylistNames, playlistMenu]
    );

    const loadingTracksDisplay = <Box sx={{width: '100%', display: 'flex', justifyContent: 'center'}}>
        <CircularProgress color="secondary" thickness={3} size={100} sx={{mt: 10}}></CircularProgress>;
    </Box>;

    return (
        <div>
            { (!accessToken && refreshToken) ? loadingTracksDisplay : null }
            { (!accessToken && !refreshToken) ? requiresLoginContent : null }
            { playlistItems?.length ? loggedInContent : null}
        </div>
    );
}


export async function getServerSideProps(context) {
    const initialPlaylists = pickNPlaylists({n: INITIAL_PLAYLIST_COUNT, picked: []});
    return {
        props: { initialPlaylists },
    }
}