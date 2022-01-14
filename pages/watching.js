import Head from 'next/head'
import Link from 'next/link'
import Layout from './components/layout'
import Carousel from './components/carousel'
import { Button, Typography, Paper } from '@material-ui/core';
import allItems from './data/drinking.json';
import styles from '../styles/drinking.module.scss';
import React, { useState, useEffect, useContext } from 'react';

const items = allItems.items;

export default function Watching() {
    const [displayBackdrop, setDisplayBackdrop] = useState(false);
    const showBackdrop = (show) => {
        console.log("I am going to show a backdrop?", show);
        setDisplayBackdrop(show);
    }

    return (
            <div className={styles.drinking}>
                <Paper elevation={3} classes={{root: styles.sectionContainer}}>
                {/* <Paper elevation={3} className={styles.sectionContainer}> */}
                    <Typography className={styles.sectionTitle} color="textSecondary" variant={'h5'}>Animation:</Typography>
                    <div className={styles.sectionContent}>
                        <Carousel type={'media'} items={items} showBackdrop={showBackdrop} />
                    </div>
                </Paper>
                <Paper elevation={3} className={styles.sectionContainer}>
                    <Typography className={styles.sectionTitle} color="textSecondary" variant={'h5'}>Comedy:</Typography>
                    <div className={styles.sectionContent}>
                        <Carousel type={'media'} items={items} showBackdrop={showBackdrop} />
                    </div>
                </Paper>
                <Paper elevation={3} className={styles.sectionContainer}>
                    <Typography className={styles.sectionTitle} color="textSecondary" variant={'h5'}>Movies:</Typography>
                    <div className={styles.sectionContent}>
                        <Carousel type={'media'} items={items} showBackdrop={showBackdrop} />
                    </div>
                </Paper>
            </div>
    );
}