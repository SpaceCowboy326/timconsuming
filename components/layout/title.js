import { styled } from '@mui/system';
import React, {  useMemo } from 'react';
import { Box, Fade, Typography } from '@mui/material';
const fadeAnimationDuration = 1000;
const PAGE_TO_TEXT = {
    drinking: 'Drinking',
    listening: 'Listening To',
    playing: 'Playing',
    watching: 'Watching',
};

const StyledContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
}));

function Title({selectedPage, transition}) {
    const pageTitleActionText = useMemo(() => <Box>
        <span>
            { PAGE_TO_TEXT[selectedPage] ? PAGE_TO_TEXT[selectedPage] + '?' : '...' }
        </span>
    </Box>, [selectedPage]);

    return (<StyledContainer color="primary">
        <Box sx={{display: 'flex'}}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end'
            }}>
                <Typography variant="h3">
                    What is Tim
                </Typography>
            </Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                paddingLeft: '0.5em',
            }}>
                <Fade in={transition} timeout={fadeAnimationDuration}>
                    <Typography variant="h3">
                        {pageTitleActionText}
                    </Typography>
                </Fade>
            </Box>
        </Box>
    </StyledContainer>);
}
export default Title;