import Image from 'next/image';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Box, Button, Card, IconButton, Tooltip, Typography } from '@mui/material';
import styles from '../../styles/item.module.scss';

// Returns an object containing the field text for an item based on its 'type'
const closeButtonTextOptions = [
    'Cool story bro.',
    'Neato.',
    'I\'m done.',
    'Next!',
    'Fin.',
];

const getFieldTextByType = (type, expanded) => {
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

    if (expanded) {
        const closeTextIndex = Math.floor(Math.random() * closeButtonTextOptions.length);
        buttonText = closeButtonTextOptions[closeTextIndex];
    }

    return {
        BUTTON: buttonText,
        NAME:   nameText,
        SOURCE: sourceText,
    }
};

export default function Item({data, actions, displayBackdrop, backdropShown, type}) {
    const [expanded, setExpanded] = useState(false);

    // Keydown listener to close modal on 'esc'
    const closeModalOnEsc = (e) => {
        if (e.code === 'Escape') {
            displayBackdrop({val: false});
            setExpanded(false);
        }
    };

    // Add/remove a keydown listener when the item is expanded/closed.
    useEffect(() => {
        document.removeEventListener('keydown', closeModalOnEsc);
        if (expanded) {
            document.addEventListener('keydown', closeModalOnEsc);
        }
        return () => document.removeEventListener('keydown', closeModalOnEsc);
    }, [expanded]);

    // If the Backdrop is no longer shown (likely from clicking on the Backdrop itself), close any expanded items
    useEffect(() => {
        if (!backdropShown && expanded) {
            setExpanded(false);
        }
    }, [backdropShown]);

    // Retrieve a list of fields 
    const itemFieldText = useMemo(() => getFieldTextByType(type, expanded), [type, expanded]);
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
        const new_state = !expanded;
        displayBackdrop({val: new_state, clickCallback: (e) => setExpanded(false)});
        setExpanded(new_state);
    };

    const handleClose = () => {
        setExpanded(false);
    };

    // If the data specifies any "actions", create a section for them.
    let actionSection = useMemo(() => <Box className={styles.actionSection}>
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
    </Box>, [actions]);

    const buttonText = expanded ? "Thanks I've heard enough." : "Tell Me More";
    
    return (
        <Card sx={{bgcolor: '#fff'}} className={itemClassName} variant="outlined">
            <Box className={styles.itemContent}>
                <Box className={styles.itemImage}>
                    {
                        data.imageUrl &&
                        <Image
                            layout="fill"
                            // height={200}
                            // width={300}
                            objectFit="cover"
                            objectPosition={data.objectPosition}
                            src={data.imageUrl}
                        />
                    }
                </Box>
                <Box className={styles.itemTitleContainer}>
                    <Typography variant="h6" className={styles.itemTitleLabel} color="textSecondary">
                        { itemFieldText.NAME }: 
                    </Typography>
                    <Typography className={styles.itemTitle}>
                        {data.name}
                    </Typography>
                </Box>

                <Box className={styles.sourceContainer}>
                    <Typography variant="h6" className={styles.sourceLabel} color="textSecondary">
                        { itemFieldText.SOURCE }: 
                    </Typography>
                    <Typography className={styles.source} >
                        {data.source}
                    </Typography>
                </Box>
                <Box className={styles.itemDescription}>
                    <Typography variant="h6" styles={{display: 'block'}} className={styles.sourceLabel} gutterBottom color="textSecondary">
                        Description: 
                    </Typography>
                    <Typography variation="body1" classes={ {body1: styles.description} }>
                        I am an ITEM and I have qualities about me that can be measured and described. I may taste like a certain flower, or I may be an entertaining but pointless entry in the realm of cinema. Whatever I may be, Tim spent a bit of time eating/drinking/playing/listening to me. For some reason, he thought that meant he should shout it out to the internet.
                    </Typography>
                </Box>
                { actionSection }
                <Box sx={{width: '100%'}}>
                    <Button
                        fullWidth={true}
                        onClick={toggleExpanded}
                        color="secondary"
                        sx={{fontSize: expanded ? '1.5em' : null}}
                        variant="contained"
                    >
                        { itemFieldText.BUTTON }
                    </Button>
                </Box>
            </Box>
        </Card>
    );
};
