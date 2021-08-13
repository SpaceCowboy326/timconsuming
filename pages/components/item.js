import Head from 'next/head'
import Image from 'next/image'
import React, { useState, useEffect, useRef } from 'react';
// import styles from '../styles/Home.module.css'
import { Backdrop, Grid, Button, Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import OpenInNewRoundedIcon from '@material-ui/icons/OpenInNewRounded';
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
        <div className={styles.itemContent}>
            <div className={styles.itemImage}>
                {
                    data.imageUrl &&
                        // <CardMedia
                        //     className={styles.media}
                        //     image={data.imageUrl}
                        //     title="Paella dish"
                        
                        // ></CardMedia>
                    <Image
                        layout="fill"
                        objectFit="cover"
                        objectPosition={data.objectPosition}
                        // height={300}
                        // width={200}
                        src={data.imageUrl}
                    />
                }
            </div>

            <div className={styles.itemTitle}>
                <Typography variant="body2" className={styles.title} gutterBottom>
                    {data.name}
                </Typography>
            </div>

            <Typography className={styles.source} color="textSecondary">
                {data.source}
            </Typography>
            <div className={styles.buttonRow}>
                <div className={styles.actionButtonContainer}>
                    <Button
                        classes={{root: styles.actionButton, label: styles.actionButtonLabel}}
                        fullWidth={true}
                        onClick={toggleExpanded}
                        className={styles.actionButton}
                        variant="contained"
                    >
                        Tell Me More
                    </Button>
                </div>
            </div>
        </div>

    </Card>);
};
