import Image from 'next/image';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Box, Button, Card, } from '@mui/material';
import ItemContent from './itemContent';
import ExpandedItemContent from './expandedItemContent';

const itemHeight = 15,
    itemWidth = 14;

const sharedItemSx = {
    bgcolor: 'background.default',
};

const expandedItemSx = {
    height: 'unset',
    overflow: 'visible',
    padding: '1.5em 2em 1em 2em',
    width: 'min(90vw, 45em)',
    zIndex: 1001,
};

const expandedContainerSx = {
    py: '5em',
    position: 'fixed',
    top: 0,
    scrollbarWidth: 'none',  /* Firefox */
    '::-webkit-scrollbar': {display: 'none'},
    left: '50%',
    height: '100vh',
    transform: 'translateX(-50%)',
    overflow: 'scroll',
    zIndex: 1001,

}

const listItemSx = {
    width: `${itemWidth}em`,
    padding: '0.5em',
    ':hover': {
        transform: 'scale(1.05)',
        transition: 'transform 0.1s linear',
    },
};

// Returns an object containing the field text for an item based on its 'type'
// const closeButtonTextOptions = [
//     'Cool story bro.',
//     'Neato.',
//     'I\'m done.',
//     'Next!',
//     'Fin.',
// ];
const closeButtonTextOptions = [
    'Next'
];

const getCloseButtonText = () => {
    const closeTextIndex = Math.floor(Math.random() * closeButtonTextOptions.length);
    return closeButtonTextOptions[closeTextIndex];
};

export default function Item({data, actions, displayBackdrop, backdropShown, type}) {
    const [expanded, setExpanded] = useState(false);
    const [scrollTop, setScrollTop] = useState(0);
    const itemRef = useRef(null)

    // Keydown listener to close modal on 'esc'
    const closeModalOnEsc = useCallback((e) => {
        if (e.code === 'Escape') {
            displayBackdrop(false);
            setExpanded(false);
        }
    }, [displayBackdrop, setExpanded]);

    // Add/remove a keydown listener when the item is expanded/closed.
    // 'document.documentElement.style.overflow = hidden' prevents the HTML from scrolling while the modal is active.
    // TODO - look into TrapFocus, might be a more appropriate solution (although this is pretty simple)
    useEffect(() => {
        document.removeEventListener('keydown', closeModalOnEsc);
        document.documentElement.style.overflow = null;
        if (expanded) {
            document.addEventListener('keydown', closeModalOnEsc);
            document.documentElement.style.overflow = 'hidden';
			itemRef.current.focus();
        }
        return () => {
            document.removeEventListener('keydown', closeModalOnEsc);
            document.documentElement.style.overflow = null;
        };
    }, [expanded, setScrollTop]);

    // If the Backdrop is no longer shown (likely from clicking on the Backdrop itself), close any expanded items
    useEffect(() => {
        if (!backdropShown && expanded) {
            setExpanded(false);
        }
    }, [backdropShown]);

    const toggleExpanded = useCallback(e => {
        const new_state = !expanded;
        displayBackdrop(new_state);
        setExpanded(new_state);
    }, [displayBackdrop, expanded]);

    const buttonText = useMemo(() => expanded ? getCloseButtonText() : 'Tell Me More', [expanded]);
    const itemContent = useMemo(
        () => expanded ? <ExpandedItemContent data={data} type={type} actions={actions}/> : <ItemContent data={data}/>,
        [actions, data, expanded, type]
    );

    const itemSx = useMemo(
        () => expanded ? {...expandedItemSx, ...sharedItemSx} : {...listItemSx, ...sharedItemSx},
        [expanded]
    );
    const itemImageHeight = expanded ? '25em' : '8em';
    return (
        <Box>
            { expanded && <Box sx={{height: `${itemHeight}em`, width: `${itemWidth}em`, visiblity: 'hidden'}}></Box> }
            <Box ref={itemRef} sx={expanded ? expandedContainerSx : null}>
                <Card
                    sx={itemSx}
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
                                    alt={`${data.name} item image`}
                                    layout="fill"
                                    objectFit="cover"
                                    objectPosition={data.objectPosition}
                                    src={data.imageUrl}
                                />
                            }
                        </Box>
                        { itemContent }
                        <Box sx={{width: '100%'}}>
                            <Button
                                fullWidth={true}
                                onClick={toggleExpanded}
                                color="secondary"
                                sx={{
                                    fontSize: expanded ? '1.5em' : null,
                                    textShadow: (theme) => `3px 2px 1px ${theme.palette.tertiary.main}`,

                                }}
                                variant="contained"
                            >
                                { buttonText }
                            </Button>
                        </Box>
                    </Box>
                </Card>
            </Box>
        </Box>
    );
};
