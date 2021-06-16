import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Layout from './components/layout';
import Carousel from './components/carousel';
import { Button, Typography, Paper } from '@material-ui/core';
import {items} from './data/drinking.json';
import styles from '../styles/drinking.module.scss';
import React, { useState, useEffect, useContext } from 'react';
const login_url = '/api/spotify/login';





export default function Listening() {
    const [displayBackdrop, setDisplayBackdrop] = useState(false);
    const showBackdrop = (show) => {
        console.log("I am going to show a backdrop?", show);
        setDisplayBackdrop(show);
    }
    const router = useRouter();
    
    const spotifyLoginRedirect = () => {
      router.push(login_url);
    };

    return (
            <div className={styles.drinking}>
                <Paper elevation={3} classes={{root: styles.sectionContainer}}>
                    <Typography className={styles.sectionTitle} color="textSecondary" variant={'h5'}>I could tell you, but I'd rather show you.</Typography>
                    <div className={styles.sectionContent}>
                        <Button onClick={spotifyLoginRedirect}>Login</Button>
                    </div>
                </Paper>
            </div>
    );
}