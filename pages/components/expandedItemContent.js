import React, { useMemo } from 'react';
import { Box, Fade, IconButton, Tooltip, Typography } from '@mui/material';
import styles from '../../styles/item.module.scss';


const getFieldTextByType = (type) => {
    let nameText = 'Name',
        sourceText = 'Source';

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
    }
};

export default function ExpandedItemContent({data, actions, type}) {
    const itemFieldText = useMemo(() => getFieldTextByType(type), [type]);
    // If the data specifies any "actions", create a section for them.
    let actionSection = useMemo(() => <Box mt={1} mb={1} sx={{display: 'flex', justifyContent: 'center'}}>
        {actions && actions.map((action, index) => {
            return (
                <Tooltip title={action.title} key={`action_${index}`}>
                    <IconButton
                        aria-label="play track"
                        color="tertiary"
                        component="span"
                        sx={{mx: 1.5}}
                        onClick={ () => action.click(data) }
                    >{action.icon}
                    </IconButton>
                </Tooltip>
            );
        })}
    </Box>, [actions]);
    console.log("Actions, bb:", actions);

    return (
        <Fade in={true} timeout={1000}>
            <Box>
                <Box sx={{alignItems: 'center', display: 'flex', minHeight: '3em'}}>
                    <Typography variant="h6" color="textSecondary">
                        { itemFieldText.NAME }: 
                    </Typography>
                    <Typography ml={3} variant="h4">
                        {data.name}
                    </Typography>
                </Box>
                <Box sx={{alignItems: 'center', display: 'flex', minHeight: '3em'}}>
                    <Typography variant="h6" color="textSecondary">
                        { itemFieldText.SOURCE }: 
                    </Typography>
                    <Typography ml={3} variant="h4">
                        {data.source}
                    </Typography>
                </Box>
                { actionSection }
            </Box>
        </Fade>
    );
};