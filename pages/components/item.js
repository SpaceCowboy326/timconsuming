import Image from 'next/image';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button, IconButton, Tooltip, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import styles from '../../styles/item.module.scss';

// Returns an object containing the field text for an item based on its 'type'
const getFieldTextByType = (type) => {
    let nameText = 'Name',
        sourceText = 'Source',
        buttonText = 'Tell Me More';

    switch (type) {
        case 'beverage':
            break;
        case 'media':
            sourceText = 'Creator'
            break;
        case 'track':
            nameText = 'Track';
            sourceText = 'Artist';
            break;
    }

    return {
        BUTTON: buttonText,
        NAME:   nameText,
        SOURCE: sourceText,
    }
};

export default function Item({data, actions, displayBackdrop, backdropShown, type}) {
    const [expanded, setExpanded] = useState(false);
    const containerRef = useRef(null)

    // If the Backdrop is no longer shown (likely from clicking on the Backdrop itself), close any expanded items
    useEffect(() => {
        if (!backdropShown && expanded) {
            setExpanded(false);
        }
    }, [backdropShown]);

    // Retrieve a list of fields 
    const itemFieldText = useMemo(() => getFieldTextByType(type), [type]);
    // console.log('itemFieldText', itemFieldText);
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
    let actionSection = useMemo(() => <div className={styles.actionSection}>
        {actions && actions.map((action, index) => {
            return (
                <Tooltip title={action.title} key={`action_${index}`}>
                    <IconButton
                        aria-label="play track"
                        color="tertiary"
                        component="span"
                        sx={{mx: 1.5}}
                        onClick={ () => action.click(data) }
                    >{action.icon}
                    </IconButton>
                </Tooltip>
            );
        })}
    </div>, [actions]);

    const buttonText = expanded ? "Thanks I've heard enough." : "Tell Me More";
    
    return (
        <div className={styles.itemContainer}>
            <Card sx={{bgcolor: '#fff'}} className={itemClassName} variant="outlined" ref={containerRef}>
                <div className={styles.itemContent}>
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
                            { itemFieldText.NAME }: 
                        </Typography>
                        <Typography className={styles.itemTitle}>
                            {data.name}
                        </Typography>
                    </div>

                    <div className={styles.sourceContainer}>
                        <Typography variant="h5" className={styles.sourceLabel} color="textSecondary">
                            { itemFieldText.SOURCE }: 
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
                                color="secondary"
                                className={styles.actionButton}
                                variant="contained"
                            >
                                { itemFieldText.BUTTON }
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};
