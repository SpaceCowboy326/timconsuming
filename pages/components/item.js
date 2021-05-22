import Head from 'next/head'
import React, { useState, useEffect, useRef } from 'react';
// import styles from '../styles/Home.module.css'
import { Backdrop, Grid, Button, Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import styles from '../../styles/item.module.scss';

export default function Item({data, displayBackdrop, backdropShown}) {
    const [count, setCount] = useState(0);
    const [dragStartPageX, setDragStartPageX] = useState(0);
    const [dragStartScrollX, setDragStartScrollX] = useState(0);
    const [scrollX, setScrollX] = useState(0);
    const [addRemoveMouseUpListener, setAddRemoveMouseUpListener] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const containerRef = useRef(null)

    // If the Backdrop is no longer shown (likely from clicking on the Backdrop itself), close any expanded items
    useEffect(() => {
        if (!backdropShown && expanded) {
            setExpanded(false);
        }
    }, [backdropShown]);

    // console.log(`I, ${data.name}, am rendering `);

    const itemClasses = [styles.item];
    if (expanded) {
        itemClasses.push(styles.item__expanded);
    }
    const itemClassName = itemClasses.join(" ");
    const toggleExpanded = e => {
        console.log(`Setting expanded to ${!expanded}`);
        const new_state = !expanded;
        displayBackdrop({val: new_state, clickCallback: (e) => setExpanded(false)});
        setExpanded(new_state);
    };

    const handleClose = () => {
        setExpanded(false);
    };
    
    return (<Card className={itemClassName} variant="outlined">
        <CardContent>
        {/* <Backdrop className={styles.backdrop} open={expanded} onClick={handleClose}> */}
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
        {/* </Backdrop> */}
        </CardContent>
        <CardActions>
            <Button onClick={toggleExpanded} size="small">Learn More</Button>
        </CardActions>
    </Card>);
};


