import { styled } from '@mui/system';
import React from 'react';
import { Box, Fade, Link, Paper, Typography } from '@mui/material';

const StyledPaper = styled(Paper)(({ theme }) => ({
    alignItems: 'start',
    display: 'flex',
    justifyContent: 'center',
    width: '99%',
}));

const StyledLink = styled(Link)(({ theme }) => ({
    color: theme.palette.background.default,
    fontWeight: 'bold',
    ':visited': {
        color: theme.palette.tertiary.main,
    }
}));

function Footer({show, playerPanelShown}) {
    const footerFadeDuration = show ? 3000 : 50;

    return (
        <Fade in={show} timeout={footerFadeDuration}>
            <Box sx={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                <StyledPaper sx={{height: playerPanelShown ? '5rem' : '3rem'}} elevation={3}>
                    <Typography sx={{mt: '1em'}} variant="body2">
                        Nav Icons made by&nbsp;
                        <StyledLink underline="hover" target="_blank" rel="noopener noreferrer" href="https://www.freepik.com" title="Freepik">Freepik</StyledLink>&nbsp;
                        from&nbsp;
                        <StyledLink underline="hover" target="_blank" rel="noopener noreferrer" href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</StyledLink>&nbsp;
                    </Typography>
                </StyledPaper>
            </Box>
        </Fade>
    );
};
export default Footer;