import Carousel from './components/carousel'
import { Button, Typography, Paper } from '@mui/material';
import allItems from './data/drinking.json';
import styles from '../styles/drinking.module.scss';
import React, { useState, useEffect, useContext } from 'react';
import {useItemData} from '../lib/util';
import {getItems} from '../lib/item/items';

const items = allItems.items;

export default function Drinking({initialItems}) {
    const [displayBackdrop, setDisplayBackdrop] = useState(false);
    const showBackdrop = (show) => {
        console.log("I am going to show a backdrop?", show);
        setDisplayBackdrop(show);

    }
    // const itemData = useItemData('Beverage');
    const itemData = {};
    console.log("INITIAL ITEM DATA", initialItems);
    console.log("ItemData is... anything?", itemData);
    console.log("ItemData data is...", itemData.data);

    return (
            <div className={styles.drinking}>
                <Paper elevation={3} classes={{root: styles.sectionContainer}}>
                {/* <Paper elevation={3} className={styles.sectionContainer}> */}
                    <Typography className={styles.sectionTitle} color="textSecondary" variant={'h5'}>Beer:</Typography>
                    <div className={styles.sectionContent}>
                        <Carousel type={'beverage'} items={items} showBackdrop={showBackdrop} />
                    </div>
                </Paper>
                <Paper elevation={3} className={styles.sectionContainer}>
                    <Typography className={styles.sectionTitle} color="textSecondary" variant={'h5'}>Cocktails:</Typography>
                    <div className={styles.sectionContent}>
                        <Carousel type={'beverage'} items={items} showBackdrop={showBackdrop} />
                    </div>
                </Paper>
                <Paper elevation={3} className={styles.sectionContainer}>
                    <Typography className={styles.sectionTitle} color="textSecondary" variant={'h5'}>Non-Alcoholic:</Typography>
                    <div className={styles.sectionContent}>
                        <Carousel type={'beverage'} items={items} showBackdrop={showBackdrop} />
                    </div>
                </Paper>
            </div>
    );
}


export async function getServerSideProps(context) {
    const initialItems = await getItems('Beverage');
    return {
        props: { initialItems },
    }
}
