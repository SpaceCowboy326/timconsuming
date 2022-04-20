import { Box, Paper, Typography } from "@mui/material";
import { keyframes, styled } from '@mui/system';
import Image from 'next/image'

const textBlink = keyframes`
    0% {
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
    85% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
`;

export default function Home() {
    return <Box sx={{display: 'flex', justifyContent: 'center', mt: '3em', height: '20em', alignContent: 'center', alignItems: 'center', position: 'relative'}}>
        <Paper elevation={3} sx={{px: '5em', py: '2em', zIndex: 1}}>
            <Paper elevation={8}  sx={{bgcolor: 'secondary.main', color: 'secondary.contrastText', display: 'flex', alignItems: 'center', p: '2em', zIndex: 3}}>
                <Typography
                    sx={{
                        animation: `${textBlink} 3s infinite`,
                        textShadow: (theme) => `3px 2px 1px ${theme.palette.tertiary.main}`,
                        zIndex: 4
                    }}
                    variant={'h5'}
                >
                    Select an Icon to Start Browsing.
                </Typography>
            </Paper>
        </Paper>
    </Box>;
};