import Head from 'next/head'
import Link from 'next/link'
import Layout from './components/layout'
import Carousel from './components/carousel'
import { Box, Button, Typography, Paper, InputLabel, TextField, Select, MenuItem, FormControl } from '@material-ui/core';
import {items} from './data/drinking.json';
import styles from '../styles/addItem.module.scss';
import React, { useState, useEffect, useContext } from 'react';
import { connectToDatabase } from '../lib/mongodb'

const ITEM_TYPES = [
    'Beverage',
    'Food',
    'Game',
    'Video',
];


const ITEM_ENDPOINT = '/api/item';


export default function AddItem() {
    const [type, setType] = useState(null);
    const [name, setName] = useState(null);
    const [source, setSource] = useState(null);
    const [description, setDescription] = useState(null);

    const saveItem = async () => {
        const itemData = {
            description,
            name,
            source,
            type,
        };

        const options = {
            body: JSON.stringify(itemData),
            method: 'POST',
        };

        const response = await fetch(url, options);
        setDescription(null);
        setName(null);
        setSource(null);
        setType(null);
        console.log("Response", response);
    };

    const typeBasedContent = (type &&
        <Box className={styles.form}>
            <Typography className={styles.sectionTitle} color="textSecondary" variant={'h5'}>Add new {type && type.toString()}:</Typography>
            <Box className={styles.formRow}>
                <FormControl className={styles.formControl}>
                    <TextField
                        id="name"
                        placeholder="What it is?"
                        label="Name"
                        value={name}
                    />
                </FormControl>
            </Box>
            <Box className={styles.formRow}>
                <FormControl className={styles.formControl}>
                    <TextField
                        id="source"
                        label="Source"
                        placeholder="Who made me?"
                        value={source}
                    />
                </FormControl>
            </Box>
            <Box className={styles.formRow}>
                <FormControl className={styles.formControl}>
                    <TextField
                        id="description"
                        label="Description"
                        multiline
                        rows={3}
                        value={description}
                        placeholder="What it do?"
                    />
                </FormControl>
            </Box>
            <Button
                // classes={{root: styles.actionButton, label: styles.actionButtonLabel}}
                // fullWidth={true}
                // onClick={toggleExpanded}
                className={styles.actionButton}
                variant="contained"
            >
                Save
            </Button>
        </Box>);

    const handleTypeChange = e => {
        setType(e.target.value);
    };

    return (
            <div className={styles.drinking}>
                <Paper elevation={3} classes={{root: styles.sectionContainer}}>
                    <Box className={styles.typeSection}>
                        <FormControl className={styles.formControl}>
                            <InputLabel id="type-label">Type</InputLabel>
                            <Select
                                labelId="type-label"
                                label="Type"
                                id="type"
                                value={type}
                                onChange={handleTypeChange}
                            >
                                { ITEM_TYPES.map(type => <MenuItem key={type} value={type}>{type}</MenuItem> ) }
                            </Select>
                        </FormControl>
                    </Box>
                    { typeBasedContent }
                </Paper>
            </div>
            
    );
}


export async function getServerSideProps(context) {
    // const { client } = await connectToDatabase()
    const {client, db} = await connectToDatabase();
    const collection = db.collection('items');
    const items = await collection.find({}).toArray();
    console.log("Collection is", collection);
    console.log("But items is items", items);
    const isConnected = false;// await client.isConnected()

    return {
      props: { isConnected },
    }
}