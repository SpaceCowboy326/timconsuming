import React, { useMemo } from 'react';
import { Box, Chip, Divider, Fade, Grid, IconButton, Link, Rating, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/system';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import LinkIcon from '@mui/icons-material/Link';
import Tags from '../tags';

const GridItemInfo = styled(Grid)(({ theme }) => ({
    alignItems: 'center',
    display: 'flex',
}));
const dataFontSize = '1.5rem';
const labelColumnSize = 2;
const valueColumnSize = 12 - labelColumnSize;
const xsLabelColumnSize = 12;
const xsValueColumnSize = 12;

const getLocationText = (data) => {
    let locationText = '';
    if (data.city) {
        locationText += `${data.city}, `
    }
    if (data?.country === 'United States of America') {
        locationText += `${data.state}`;
    }
    else {
        locationText += `${data.country}`;
    }
    return locationText;
};

const getFieldTextByType = (type) => {
    let nameText = 'Name',
        sourceText = 'Source',
        albumText = 'Album',
        cityText = 'City',
        stateText = 'State',
        locationText = 'Where Can I Find It?',
        tagsText = 'Related Categories',
        ratingText = 'What did Tim think?',
        countryText = 'Country',
        descriptionText = 'Description';

    switch (type) {
        case 'beverage':
            break;
        case 'game':
            locationText = 'Where Can I Find Them?';
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
        RATING: ratingText,
        DESCRIPTION: descriptionText,
    }
};

const ratingToText = rating => {
    let ratingText;
    switch (rating) {
        case 10:
            ratingText = '¡Perfección!';
            break;
        case 9:
            ratingText = 'Well hot damn';
            break;
        case 8:
            ratingText = 'Pretty Dang Good';
            break;
        case 7:
            ratingText = 'I dig it';
            break;
        case 6:
            ratingText = 'Better Than Average';
            break;
        case 5:
            ratingText = 'It\'s Alright';
            break;
        case 4:
            ratingText = 'Not So Great';
            break;
        case 3:
            ratingText = 'Meh.';
            break;
        case 2:
            ratingText = 'Would not play again';
            break;
        case 1:
            ratingText = 'Did They Even Try?';
            break;
        default:
            ratingText = "ERROR RATING INCORRECT"
            break;
    }
    return ratingText
};

export default function ExpandedItemContent({data, actions, type}) {
    const itemFieldText = useMemo(() => getFieldTextByType(type), [type]);
    // If the data specifies any "actions", create a section for them.
    const actionSection = useMemo(() => <React.Fragment>
        <Divider><Chip sx={{fontSize: '1rem'}} label='But What Can I Do With It?'/></Divider>
        <Box mt={1} sx={{display: 'flex', justifyContent: 'center'}}>
            {actions && actions.map((action, index) => {
                return (
                    <Tooltip title={action.title} key={`action_${index}`}>
                        <IconButton
                            aria-label="play track"
                            color="tertiary"
                            component="span"
                            sx={{mx: '.35em'}}
                            onClick={ (e) => action.click({data, e}) }
                        >{action.icon}
                        </IconButton>
                    </Tooltip>
                );
            })}
        </Box>
    </React.Fragment>, [actions]);

    return (
        <Fade in={true} timeout={500}>
            <Box sx={{mt: '.5em', mb: '1rem'}}>
                <Divider><Chip sx={{fontSize: '1rem'}} label='Basic Info'/></Divider>
                <Grid container sx={{mb: '1rem'}}>
                    <GridItemInfo sx={{justifyContent: 'left', pt: '.25rem'}} item md={labelColumnSize} xs={xsLabelColumnSize}>
                        <Typography variant="h6" color="textSecondary">
                                { itemFieldText.NAME }: 
                        </Typography>
                    </GridItemInfo>
                    <GridItemInfo item md={valueColumnSize} xs={xsValueColumnSize}>
                        <Typography sx={{fontSize: dataFontSize}} variant="body1">
                            {data.name}
                            { data.nameUrl && 
                                <Link
                                    aria-label={`${itemFieldText.NAME} External Link`}
                                    color="tertiary.main"
                                    href={data.nameUrl}
                                    target="_blank"
                                    rel="noopener"
                                    sx={{ml: '.25em'}}
                                ><LinkIcon/>
                                </Link>
                            }
                        </Typography>
                    </GridItemInfo>
                    <GridItemInfo sx={{justifyContent: 'left', pt: '.25rem'}} item md={labelColumnSize} xs={xsLabelColumnSize}>
                        <Typography variant="h6" color="textSecondary">
                            { itemFieldText.SOURCE }: 
                        </Typography>
                    </GridItemInfo>
                    <GridItemInfo item xs={valueColumnSize}>
                        <Typography sx={{fontSize: dataFontSize}} variant="body1">
                            {data.source}
                            { data.sourceUrl && 
                                <Link
                                    aria-label={`${itemFieldText.SOURCE} External Link`}
                                    color="tertiary.main"
                                    href={data.sourceUrl}
                                    target="_blank"
                                    rel="noopener"
                                    sx={{ml: '.25em'}}
                                ><LinkIcon/>
                                </Link>
                            }
                        </Typography>
                    </GridItemInfo>
                    {data.album && <GridItemInfo sx={{justifyContent: 'left', pt: '.25rem'}} item xs={labelColumnSize}>
                        <Typography variant="h6" color="textSecondary">
                            { itemFieldText.ALBUM }: 
                        </Typography>
                    </GridItemInfo>}
                    {data.album && <GridItemInfo item md={valueColumnSize} xs={xsValueColumnSize}>
                        <Typography sx={{fontSize: dataFontSize}} variant="body1">
                            {data.album}
                        </Typography>
                    </GridItemInfo>}
                    { data.country && <GridItemInfo item sx={{ mt: 1}} xs={12}>
                        <Typography variant="h6" color="textSecondary">
                            { itemFieldText.LOCATION }
                        </Typography>
                    </GridItemInfo>}
                    {data.country && <GridItemInfo item xs={12}>
                        <Typography sx={{fontSize: '1.5rem'}} variant="body1">
                            { getLocationText(data)}
                        </Typography>
                    </GridItemInfo>}
                </Grid>
                {
                    (data?.tags?.length || data.rating || data.description) &&
                        <Divider><Chip sx={{fontSize: '1rem'}} label='Subjective Details'/></Divider>
                }
                { data.description && <React.Fragment>
                    <GridItemInfo item sx={{ mt: 1}} xs={12}>
                        <Typography variant="h6" color="textSecondary">
                            { itemFieldText.DESCRIPTION }
                        </Typography>
                    </GridItemInfo>
                    <GridItemInfo item sx={{ mt: 1}} xs={12}>
                        <Typography paragraph={true} variant="body1">
                            {data.description}
                        </Typography>
                    </GridItemInfo>
                </React.Fragment>}
                { data?.tags?.length && <React.Fragment>
                    <GridItemInfo item xs={valueColumnSize}>
                        <Typography
                            variant="h6"
                            color="textSecondary"
                        >
                            { itemFieldText.TAGS }
                        </Typography>
                    </GridItemInfo>
                    <GridItemInfo item xs={valueColumnSize}>
                        <Tags readOnly={true} tags={data.tags}/>
                    </GridItemInfo>
                </React.Fragment>}
                { data.rating && <React.Fragment>
                    <GridItemInfo item sx={{mt: 2}} xs={12}>
                        <Typography variant="h6" color="textSecondary">
                            {itemFieldText.RATING}
                        </Typography>
                    </GridItemInfo>
                    <GridItemInfo>
                        <Rating
                            sx={{color: "tertiary.main"}}
                            readOnly
                            value={data.rating}
                            max={10}
                            icon={<FavoriteIcon sx={{fontSize:'2rem'}}/>}
                            emptyIcon={<HeartBrokenIcon sx={{fontSize:'2rem'}}/>}
                        />
                        <Typography sx={{ml: '1em'}} variant="h6">{ratingToText(data.rating)}</Typography>
                    </GridItemInfo>
                </React.Fragment>}
                { actions?.length && actionSection }
            </Box>
        </Fade>
    );
};