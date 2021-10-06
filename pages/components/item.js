import Image from 'next/image'
import React, { useState, useEffect, useRef } from 'react';
// import styles from '../styles/Home.module.css'
import { Backdrop, Grid, Button, Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import styles from '../../styles/item.module.scss';
import Drink from './items/drink';

const getExpandedContent = (data) => {


};

const getStandardContent = (data) => {


};

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

    const buttonText = expanded ? "Thanks I've heard enough." : "Tell Me More";

    const defaultItemContent = <div className={styles.itemContent}>
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
        
        <div className={styles.itemTitleContainer}>
                <Typography variant="h5" className={styles.itemTitleLabel} gutterBottom>
                    Name: 
                </Typography>
            <div className={styles.itemTitle}>
                <Typography variant="body2" className={styles.itemTitle} gutterBottom>
                    {data.name}
                </Typography>
            </div>
        </div>

        <div className={styles.sourceContainer}>
            <Typography variant="h5" className={styles.sourceLabel} gutterBottom color="textSecondary">
                Source: 
            </Typography>
            <Typography className={styles.source} color="textSecondary">
                {data.source}
            </Typography>
        </div>
        <div className={styles.itemDescription}>
            <Typography variant="h5" styles={{display: 'block'}} className={styles.sourceLabel} gutterBottom color="textSecondary">
                Description: 
            </Typography>
            <Typography variation="body1" classes={ {body1: styles.description} }>
                I am an ITEM and I have qualities about me that can be measured and described. I may taste like a certain flower, or I may be an entertaining but pointless entry in the realm of cinema. Whatever I may be, Tim spent a bit of time eating/drinking/playing/listening to me. For some reason, he thought that meant he should shout it out to the internet.
            </Typography>
        </div>
        <div className={styles.buttonRow}>
            <div className={styles.actionButtonContainer}>
                <Button
                    classes={{root: styles.actionButton, label: styles.actionButtonLabel}}
                    fullWidth={true}
                    onClick={toggleExpanded}
                    className={styles.actionButton}
                    variant="contained"
                >
                    {buttonText}
                </Button>
            </div>
        </div>
    </div>;

    let itemContent;
    console.log("data type", data.type);
    switch (data.type) {
            case 'drink': 
                itemContent = <Drink toggleExpanded={toggleExpanded} data={data}></Drink>;
                break;
            default:
                itemContent = <Drink toggleExpanded={toggleExpanded} data={data}></Drink>;
                // itemContent = defaultItemContent;
                break;
    }

    
    return (<Card className={itemClassName} variant="outlined">
        {defaultItemContent}
        {/* <div className={styles.itemContent}>
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
        </div> */}
    </Card>);
};
