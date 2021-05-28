import Head from 'next/head'
import Link from 'next/link'
import Layout from './components/layout'
import Carousel from './components/carousel'
import { Button, Typography, Paper } from '@material-ui/core';
import {items} from './data/drinking.json';
import styles from '../styles/drinking.module.scss';
import React, { useState, useEffect, useContext } from 'react';


export default function Playing() {
    const [displayBackdrop, setDisplayBackdrop] = useState(false);
    const showBackdrop = (show) => {
        console.log("I am going to show a backdrop?", show);
        setDisplayBackdrop(show);
    }

    return (
            <div className={styles.drinking}>
                <Paper elevation={3} classes={{root: styles.sectionContainer}}>
                {/* <Paper elevation={3} className={styles.sectionContainer}> */}
                    <Typography className={styles.sectionTitle} color="textSecondary" variant={'h5'}>FPS:</Typography>
                    <div className={styles.sectionContent}>
                        <Carousel items={items} showBackdrop={showBackdrop} />
                    </div>
                </Paper>
                <Paper elevation={3} className={styles.sectionContainer}>
                    <Typography className={styles.sectionTitle} color="textSecondary" variant={'h5'}>RPG:</Typography>
                    <div className={styles.sectionContent}>
                        <Carousel items={items} showBackdrop={showBackdrop} />
                    </div>
                </Paper>
                <Paper elevation={3} className={styles.sectionContainer}>
                    <Typography className={styles.sectionTitle} color="textSecondary" variant={'h5'}>Multiplayer:</Typography>
                    <div className={styles.sectionContent}>
                        <Carousel items={items} showBackdrop={showBackdrop} />
                    </div>
                </Paper>
            </div>
    );
}