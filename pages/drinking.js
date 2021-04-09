import Head from 'next/head'
import Link from 'next/link'
import Layout from './components/layout'
import Carousel from './components/carousel'
import { Button, Typography } from '@material-ui/core';
import {items} from './data/drinking.json';
import styles from '../styles/drinking.module.scss';



export default function Drinking() {
console.log("items", items);

    return (<Layout selectedPage={'drinking'}>
            <div className={styles.drinking}>
                <div className={styles.sectionContainer}>
                    <Typography className={styles.sectionTitle} color="textSecondary" variant={'h5'}>Beer:</Typography>
                    <div className={styles.sectionContent}>
                        <Carousel items={items} />
                    </div>
                </div>
                <div className={styles.sectionContainer}>
                    <Typography className={styles.sectionTitle} color="textSecondary" variant={'h5'}>Cocktails:</Typography>
                    <div className={styles.sectionContent}>
                        <Carousel items={items} />
                    </div>
                </div>
                <div className={styles.sectionContainer}>
                    <Typography className={styles.sectionTitle} color="textSecondary" variant={'h5'}>Non-Alcoholic:</Typography>
                    <div className={styles.sectionContent}>
                        <Carousel items={items} />
                    </div>
                </div>
            </div>
            
    </Layout>);
}