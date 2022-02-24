import Image from 'next/image';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Button, Card, IconButton, Tooltip, Typography } from '@mui/material';
import styles from '../../styles/item.module.scss';

const itemHeight = 15,
    itemWidth = 14;

const sharedItemSx = {
    bgcolor: 'white',
};
const expandedItemSx = {
        height: 'unset',
        left: '50%',
        maxHeight: 'unset',
        padding: '1.5em 2em 1em 2em',
        position: 'fixed',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(80vw, 45em)',
        zIndex: 1001,
};
const listItemSx = {
    // height: `${itemHeight}em`,
    // maxHeight: `${itemHeight}em`,
    width: `${itemWidth}em`,
    padding: '0.5em',
    ':hover': {
        // .title {
            // color: $primary-text;
        // }
        transform: 'scale(1.05)',
        transition: 'transform 0.1s linear',
    },
};

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
    const closeModalOnEsc = useCallback((e) => {
        console.log("Close on ESC!");
        if (e.code === 'Escape') {
            displayBackdrop({val: false});
            setExpanded(false);
        }
    }, [displayBackdrop, setExpanded]);

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
            console.log("no backdrop? expanded? shut it down");
            setExpanded(false);
        }
    }, [backdropShown]);

    // Retrieve an object containing the proper labels for fields, based on type.
    const itemFieldText = useMemo(() => getFieldTextByType(type, expanded), [type, expanded]);

    const toggleExpanded = useCallback(e => {
        const new_state = !expanded;
        console.log("Setting expanded to...", new_state);

        displayBackdrop({val: new_state, clickCallback: (e) => {console.log("click CALLBACK"); setExpanded(false)}});
        setExpanded(new_state);
    }, [displayBackdrop, expanded]);

    // const handleClose = useCallback(() => setExpanded(false), [setExpanded]);

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

    // const buttonText = expanded ? "Thanks I've heard enough." : "Tell Me More";
    // const calculatedItemHeight = expanded ? 'unset' : `${itemHeight}em`,
        // calculatedItemWidth = expanded ? expandedItemWidth : `${itemWidth}em`;

    const itemSx = useMemo(
        () => expanded ? {...expandedItemSx, ...sharedItemSx} : {...listItemSx, ...sharedItemSx},
        [expanded]
    );
    const itemImageHeight = expanded ? '25em' : '8em';

    console.log("Rendering item. Expanded?", {expanded, name: data.name});

    return (
        <Card sx={itemSx}
            variant="outlined"
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}>
                <Box sx={{
                    height: `${itemImageHeight}`,
                    position: 'relative',
                    width: '100%',
                }}>
                    {
                        data.imageUrl &&
                        <Image
                            layout="fill"
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
                <Box sx={{mt: '.5em', width: '100%'}}>
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
