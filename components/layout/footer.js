import { styled } from '@mui/system';
import React from 'react';
import { Box, Fade, Link, Paper, Typography } from '@mui/material';
import Image from 'next/image'

const StyledPaper = styled(Paper)(({ theme }) => ({
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    width: '99%',
}));

const StyledLink = styled(Link)(({ theme }) => ({
    color: theme.palette.tertiary.main,
    fontWeight: 'bold',
    ':visited': {
        color: theme.palette.background.default,
    }
}));

function Footer({show, playerPanelShown}) {
    const footerFadeDuration = show ? 3000 : 50;

    return (
        <Fade in={show} timeout={footerFadeDuration}>
            <Box sx={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                <StyledPaper sx={{height: playerPanelShown ? '7rem' : '4.5rem'}} elevation={3}>
                    <Typography sx={{mt: '1em'}} variant="body2">
                        Nav Icons made by&nbsp;
                        <StyledLink underline="hover" target="_blank" rel="noopener noreferrer" href="https://www.freepik.com" title="Freepik">Freepik</StyledLink>&nbsp;
                        from&nbsp;
                        <StyledLink underline="hover" target="_blank" rel="noopener noreferrer" href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</StyledLink>&nbsp;
                    </Typography>
                    <Link
                        underline="hover"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/SpaceCowboy326"
                        title="GitHub"
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                            mt: '.5em'
                        }}
                    >
                        <Box sx={{height: '1.5em', width: '1.5em'}}>
                            <Image
                                height={64}
                                layout="responsive"
                                width={64}
                                src={'/images/github-mark.png'}
                            />
                        </Box>
                        <StyledLink
                            sx={{
                                ml: '.25em',
                            }}>
                            @SpaceCowboy326
                        </StyledLink>
                    </Link>
                </StyledPaper>
            </Box>
        </Fade>
    );
};
export default Footer;