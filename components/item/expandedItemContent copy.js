import React, { useMemo } from 'react';
import { Box, Chip, Divider, Fade, IconButton, Tooltip, Typography } from '@mui/material';

const dataFontSize = '1.5em';

const getFieldTextByType = (type) => {
    let nameText = 'Name',
        sourceText = 'Source',
        albumText = 'Album',
        cityText = 'City',
        stateText = 'State',
        locationText = 'Where Can I Find It?',
        tagsText = 'Related Categories',
        countryText = 'Country';

    switch (type) {
        case 'beverage':
            break;
        case 'media':
            sourceText = 'Creator'
            break;
        case 'track':
            nameText = 'Track';
            sourceText = 'Artist';
            break;
    }

    return {
        NAME:   nameText,
        SOURCE: sourceText,
        ALBUM: albumText,
        COUNTRY: countryText,
        CITY: cityText,
        STATE: stateText,
        LOCATION: locationText,
        TAGS: tagsText,
    }
};

export default function ExpandedItemContent({data, actions, type}) {
    const itemFieldText = useMemo(() => getFieldTextByType(type), [type]);
    // If the data specifies any "actions", create a section for them.
    const actionSection = useMemo(() => <React.Fragment>
        <Divider><Chip label='But What Can I Do With It?'/></Divider>
        <Box mt={1} sx={{display: 'flex', justifyContent: 'center'}}>
            {actions && actions.map((action, index) => {
                return (
                    <Tooltip title={action.title} key={`action_${index}`}>
                        <IconButton
                            aria-label="play track"
                            color="tertiary"
                            component="span"
                            sx={{mx: 1.5}}
                            onClick={ (e) => action.click({data, e}) }
                        >{action.icon}
                        </IconButton>
                    </Tooltip>
                );
            })}
        </Box>
    </React.Fragment>, [actions]);

    return (
        <Fade in={true} timeout={1000}>
            <Box sx={{mt: '.5em', mb: '1em'}}>
                <Divider><Chip label='What it is?'/></Divider>
                <Box sx={{alignItems: 'center', display: 'flex', height: '3em'}}>
                    <Typography variant="h6" color="textSecondary">
                        { itemFieldText.NAME }: 
                    </Typography>
                    <Typography ml={3} sx={{fontSize: dataFontSize}} variant="body1">
                        {data.name}
                    </Typography>
                </Box>
                <Box sx={{alignItems: 'center', display: 'flex', minHeight: '3em'}}>
                    <Typography variant="h6" color="textSecondary">
                        { itemFieldText.SOURCE }: 
                    </Typography>
                    <Typography ml={3} sx={{fontSize: dataFontSize}} variant="body1">
                        {data.source}
                    </Typography>
                </Box>
                {data.album ?
                    <Box sx={{alignItems: 'center', display: 'flex', minHeight: '3em'}}>
                        <Typography variant="h6" color="textSecondary">
                            { itemFieldText.ALBUM }: 
                        </Typography>
                        <Typography ml={3} sx={{fontSize: dataFontSize}} variant="body1">
                            {data.album}
                        </Typography>
                    </Box> :
                    null
                }
                { data.country ? 
                    <Box sx={{mt: '.5em'}}>
                        <Typography variant="h6" color="textSecondary">
                            { itemFieldText.LOCATION }
                        </Typography>
                        <Typography sx={{fontSize: '1.5em'}} variant="body1">
                            { data.country === 'United States of America' ?
                                `${data.city}, ${data.state}.` :
                                `${data.city}, ${data.country}.`
                            }
                        </Typography>
                    </Box> :
                    null
                }
                { data?.tags?.length ?
                    <Box sx={{mt: '.5em'}}>
                        <Typography
                            variant="h6"
                            color="textSecondary"
                        >
                            { itemFieldText.TAGS }
                        </Typography>
                        <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
                            {data.tags.map((tag) =>
                                <Chip
                                    label={tag}
                                    key={`tag_${tag}`}
                                    sx={{
                                        bgcolor: 'tertiary.main',
                                        color: 'background.default',
                                        fontSize: '1em',
                                        mr: '.5em',
                                    }}
                                />
                            )}
                        </Box>
                    </Box> :
                    null
                }
                { actions?.length && actionSection }
            </Box>
        </Fade>
    );
};