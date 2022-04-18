import React, {  useMemo, useRef } from 'react';
import { styled } from '@mui/system';
import { Box, Fade, Typography } from '@mui/material';

// Haven't been able to get this to work correctly for the page title transitions yet.
// Would be nice to slowly shrink the text so the layout shift isn't as bad.
// const actionWordShrinkEffect = keyframes`
//     0% {
//         opacity: 1;
//     }
//     100% {
//         letter-spacing -0.5em;
//         opacity: 0;
//     }
// `;

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
    paddingTop: '0.5em',
    width: '100%',
}));

function Title({selectedPage, transition}) {
    const actionTextRef = useRef(null);
    const pageTitleActionText = useMemo(() => <Box>
        <span>
            { PAGE_TO_TEXT[selectedPage] ? PAGE_TO_TEXT[selectedPage] + '?' : '...' }
        </span>
    </Box>, [selectedPage]);

    return (<StyledContainer color="primary">
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
                    <Typography ref={actionTextRef} variant="h3">
                        {pageTitleActionText}
                    </Typography>
                </Fade>
            </Box>
    </StyledContainer>);
}
export default Title;