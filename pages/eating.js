import Head from 'next/head'
import Link from 'next/link'
import Layout from './components/layout'
import Carousel from './components/carousel'
import { Button, Typography, Paper } from '@mui/material';
import {items} from './data/drinking.json';
import styles from '../styles/drinking.module.scss';
import React, { useState, useEffect, useContext } from 'react';


export default function Eating() {
    const [displayBackdrop, setDisplayBackdrop] = useState(false);
    const showBackdrop = (show) => {
        console.log("I am going to show a backdrop?", show);
        setDisplayBackdrop(show);
    }

    return (
            <div className={styles.drinking}>
                <Paper elevation={3} classes={{root: styles.sectionContainer}}>
                {/* <Paper elevation={3} className={styles.sectionContainer}> */}
                    <Typography className={styles.sectionTitle} color="textSecondary" variant={'h5'}>Healthy:</Typography>
                    <div className={styles.sectionContent}>
                        <Carousel items={items} showBackdrop={showBackdrop} />
                    </div>
                </Paper>
                <Paper elevation={3} className={styles.sectionContainer}>
                    <Typography className={styles.sectionTitle} color="textSecondary" variant={'h5'}>Homemade:</Typography>
                    <div className={styles.sectionContent}>
                        <Carousel items={items} showBackdrop={showBackdrop} />
                    </div>
                </Paper>
                <Paper elevation={3} className={styles.sectionContainer}>
                    <Typography className={styles.sectionTitle} color="textSecondary" variant={'h5'}>Snacks:</Typography>
                    <div className={styles.sectionContent}>
                        <Carousel items={items} showBackdrop={showBackdrop} />
                    </div>
                </Paper>
            </div>
        );
}