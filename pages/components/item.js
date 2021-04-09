import Head from 'next/head'
import React, { useState, useEffect, useRef } from 'react';
// import styles from '../styles/Home.module.css'
import { Grid, Button, Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import styles from '../../styles/item.module.scss';

export default function Item({data}) {
    const [count, setCount] = useState(0);
    const [dragStartPageX, setDragStartPageX] = useState(0);
    const [dragStartScrollX, setDragStartScrollX] = useState(0);
    const [scrollX, setScrollX] = useState(0);
    const [addRemoveMouseUpListener, setAddRemoveMouseUpListener] = useState(false);
    const containerRef = useRef(null)

    console.log(`I, ${data.name}, am rendering `);

    
    return (<Card className={styles.root} variant="outlined">
        <CardContent>
            <Typography className={styles.title} color="textSecondary" gutterBottom>
                {data.name}
            </Typography>

            <Typography className={styles.pos} color="textSecondary">
                {data.source}
            </Typography>
            <Typography variant="body2" component="p">
                well meaning and kindly.
                <br />
                {'"a benevolent smile"'}
            </Typography>
        </CardContent>
        <CardActions>
            <Button size="small">Learn More</Button>
        </CardActions>
    </Card>);
};


