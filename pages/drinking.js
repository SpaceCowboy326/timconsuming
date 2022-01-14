import Head from 'next/head'
import Link from 'next/link'
import Layout from './components/layout'
import Carousel from './components/carousel'
import { Button, Typography, Paper } from '@material-ui/core';
import allItems from './data/drinking.json';
import styles from '../styles/drinking.module.scss';
import React, { useState, useEffect, useContext } from 'react';
import { connectToDatabase } from '../lib/mongodb'

const items = allItems.items;


export default function Drinking() {
    const [displayBackdrop, setDisplayBackdrop] = useState(false);
    const showBackdrop = (show) => {
        console.log("I am going to show a backdrop?", show);
        setDisplayBackdrop(show);
    }

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
    // const { client } = await connectToDatabase()
    const {client, db} = await connectToDatabase();
    const collection = db.collection('items');
    const items = await collection.find({}).toArray();
    // console.log("Collection is", collection);
    console.log("But items is items", items);
    const isConnected = false;// await client.isConnected()

    return {
      props: { isConnected },
    }
  }
  