import React from 'react';
import { Box, Fade, Typography } from '@mui/material';

const textSx = {
    display: 'inline-block',
    maxWidth: '13em',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
};

export default function ItemContent({data}) {
    return (
        <Fade in={true} timeout={1000}>
            <Box>
                <Box mt={.5}>
                    <Typography sx={textSx} title={data.name}>
                        {data.name}
                    </Typography>
                </Box>
                <Box>
                    <Typography sx={textSx} title={data.source}>
                        {data.source}
                    </Typography>
                </Box>
            </Box>
        </Fade>
    );
};