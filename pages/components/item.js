import Image from 'next/image'
import React, { useState, useEffect, useRef } from 'react';
import { Backdrop, Grid, Button, IconButton, Tooltip, Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import styles from '../../styles/item.module.scss';
import Drink from './items/drink';

export default function Item({data, actions, displayBackdrop, backdropShown}) {
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
    else {
        itemClasses.push(styles.item__normal);
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

    // If the data specifies any "actions", create a section for them.
    let actionSection = null;
    if (actions) {
        actionSection = <div className={styles.actionSection}>
        { actions.map((action, index) => {
            return <Tooltip title={action.title} key={`action_${index}`}>
                <IconButton
                    color="primary"
                    onClick={ () => action.click(data) }
                    aria-label="play track"
                    component="span"
                >
                    {action.icon}
                </IconButton>
            </Tooltip>
        })}
        </div>;
    }

    const buttonText = expanded ? "Thanks I've heard enough." : "Tell Me More";

    const defaultItemContent = <div className={styles.itemContent}>
        <div className={styles.itemImage}>
            {
                data.imageUrl &&
                <Image
                    layout="fill"
                    objectFit="cover"
                    objectPosition={data.objectPosition}
                    src={data.imageUrl}
                />
            }
        </div>
        <div className={styles.itemTitleContainer}>
            <Typography variant="h5" className={styles.itemTitleLabel} color="textSecondary">
                Name: 
            </Typography>
            <Typography className={styles.itemTitle}>
                {data.name}
            </Typography>
        </div>

        <div className={styles.sourceContainer}>
            <Typography variant="h5" className={styles.sourceLabel} color="textSecondary">
                Source: 
            </Typography>
            <Typography className={styles.source} >
                {data.source}
            </Typography>
        </div>
        <div className={styles.itemDescription}>
            <Typography variant="h5" styles={{display: 'block'}} className={styles.sourceLabel} gutterBottom color="textSecondary">
                Description: 
            </Typography>
            <Typography variation="body1" classes={ {body1: styles.description} }>
                I am an ITEM and I have qualities about me that can be measured and described. I may taste like a certain flower, or I may be an entertaining but pointless entry in the realm of cinema. Whatever I may be, Tim spent a bit of time eating/drinking/playing/listening to me. For some reason, he thought that meant he should shout it out to the internet.

                I am an ITEM and I have qualities about me that can be measured and described. I may taste like a certain flower, or I may be an entertaining but pointless entry in the realm of cinema. Whatever I may be, Tim spent a bit of time eating/drinking/playing/listening to me. For some reason, he thought that meant he should shout it out to the internet.
            </Typography>
        </div>
        { actionSection }
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
    switch (data.type) {
            case 'drink': 
                itemContent = <Drink toggleExpanded={toggleExpanded} data={data}></Drink>;
                break;
            default:
                itemContent = <Drink toggleExpanded={toggleExpanded} data={data}></Drink>;
                // itemContent = defaultItemContent;
                break;
    }

    
    return (
        <div className={styles.itemContainer}>
            <Card className={itemClassName} variant="outlined" ref={containerRef}>
                {defaultItemContent}
            </Card>
        </div>
    );
};
