import Head from 'next/head'
import Link from 'next/link'
import Layout from './components/layout'
import Carousel from './components/carousel'
import { Button, Typography } from '@material-ui/core';
import {items} from './data/drinking.json';
import styles from '../styles/drinking.module.scss';
import React, { useState, useEffect, useContext } from 'react';



export default function Drinking() {
    const [displayBackdrop, setDisplayBackdrop] = useState(false);
    const showBackdrop = (show) => {
        console.log("I am going to show a backdrop?", show);
        setDisplayBackdrop(show);
    }

    return (<Layout selectedPage={'drinking'} displayBackdrop={displayBackdrop}>
            <div className={styles.drinking}>
                <div className={styles.sectionContainer}>
                    <Typography className={styles.sectionTitle} color="textSecondary" variant={'h5'}>Beer:</Typography>
                    <div className={styles.sectionContent}>
                        <Carousel items={items} showBackdrop={showBackdrop} />
                    </div>
                </div>
                <div className={styles.sectionContainer}>
                    <Typography className={styles.sectionTitle} color="textSecondary" variant={'h5'}>Cocktails:</Typography>
                    <div className={styles.sectionContent}>
                        <Carousel items={items} showBackdrop={showBackdrop} />
                    </div>
                </div>
                <div className={styles.sectionContainer}>
                    <Typography className={styles.sectionTitle} color="textSecondary" variant={'h5'}>Non-Alcoholic:</Typography>
                    <div className={styles.sectionContent}>
                        <Carousel items={items} showBackdrop={showBackdrop} />
                    </div>
                </div>
            </div>
            
    </Layout>);
}