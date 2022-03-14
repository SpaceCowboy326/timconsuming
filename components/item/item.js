import Image from 'next/image';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Box, Button, Card, } from '@mui/material';
import ItemContent from './itemContent';
import ExpandedItemContent from './expandedItemContent';

const itemHeight = 15,
    itemWidth = 14;

const sharedItemSx = {
    bgcolor: 'white',
};
const expandedItemSx = {
        height: 'unset',
        left: '50%',
        // maxHeight: '90vh',
        overflow: 'visible',
        msOverflowStyle: 'none',  /* Internet Explorer 10+ */
        scrollbarWidth: 'none',  /* Firefox */
        '::-webkit-scrollbar': {display: 'none'},
        padding: '1.5em 2em 1em 2em',
        // transition: 'transform .5s ease-out !important',
        position: 'fixed',
        top: '10vh',
        // top: '50%',
        // transform: 'translateX(-50%)',
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

const getCloseButtonText = () => {
    const closeTextIndex = Math.floor(Math.random() * closeButtonTextOptions.length);
    return closeButtonTextOptions[closeTextIndex];
};

export default function Item({data, actions, displayBackdrop, backdropShown, type}) {
    const [expanded, setExpanded] = useState(false);
    const [scrollTop, setScrollTop] = useState(0);
    const containerRef = useRef(null)


    // Keydown listener to close modal on 'esc'
    const closeModalOnEsc = useCallback((e) => {
        if (e.code === 'Escape') {
            displayBackdrop({val: false});
            setExpanded(false);
        }
    }, [displayBackdrop, setExpanded]);

    const modalScroll = useCallback((e) => {
        const newScrollTop = scrollTop + (e.deltaY * -0.04);
        const itemClientRect = containerRef.current.getBoundingClientRect();

        // Prevent scrolling down if the bottom of the modal is already visible.
        if (
            ((window.innerHeight - itemClientRect.bottom ) > 50) &&
            newScrollTop < scrollTop
        ) {
             return;
        }
        // Prevent scrolling up if the modal top is already visible.
        if (newScrollTop > 0) return;

        setScrollTop(newScrollTop);
    }, [containerRef, scrollTop, setScrollTop]);

    // Add/remove a keydown listener when the item is expanded/closed.
    // 'document.documentElement.style.overflow = hidden' prevents the HTML from scrolling while the modal is active.
    useEffect(() => {
        // TODO - one useEffect or 2?
        if (!expanded) {
            containerRef.current.style.transform = null;
            setScrollTop(0);
        }
        document.removeEventListener('keydown', closeModalOnEsc);
        document.documentElement.style.overflow = null;
        if (expanded) {
            document.addEventListener('keydown', closeModalOnEsc);
            document.documentElement.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', closeModalOnEsc);
            document.documentElement.style.overflow = null;
            // document.removeEventListener('wheel', preventScroll);

            // containerRef.current.removeEventListener('wheel', modalScroll);
        };
    }, [expanded, setScrollTop]);

    // If the Backdrop is no longer shown (likely from clicking on the Backdrop itself), close any expanded items
    useEffect(() => {
        if (!backdropShown && expanded) {
            setExpanded(false);
        }
    }, [backdropShown]);

    // Retrieve an object containing the proper labels for fields, based on type.
    // const itemFieldText = useMemo(() => getFieldTextByType(type, expanded), [type, expanded]);

    const toggleExpanded = useCallback(e => {
        const new_state = !expanded;
        displayBackdrop({val: new_state, clickCallback: (e) => setExpanded(false)});
        setExpanded(new_state);
    }, [displayBackdrop, expanded]);

    const buttonText = useMemo(() => expanded ? getCloseButtonText() : 'Tell Me More', [expanded]);
    const itemContent = useMemo(
        () => expanded ? <ExpandedItemContent data={data} type={type} actions={actions}/> : <ItemContent data={data}/>,
        [actions, data, expanded, type]
    );

    // const handleClose = useCallback(() => setExpanded(false), [setExpanded]);

    // const buttonText = expanded ? "Thanks I've heard enough." : "Tell Me More";
    // const calculatedItemHeight = expanded ? 'unset' : `${itemHeight}em`,
        // calculatedItemWidth = expanded ? expandedItemWidth : `${itemWidth}em`;

    const itemSx = useMemo(
        () => expanded ? {...expandedItemSx, ...sharedItemSx} : {...listItemSx, ...sharedItemSx},
        [expanded]
    );
    const itemImageHeight = expanded ? '28em' : '8em';

    if (expanded) {
        containerRef.current.style.transform = scrollTop ? `translate(-50%, ${scrollTop}%)` : 'translate(-50%, 0)';
        // containerRef.current.style.transform = 'translate(-50%, 0)';
    }
    // console.log("Rendering item. Expanded?", {expanded, name: data.name});

    return (
        <Box>
            { expanded && <Box sx={{height: `${itemHeight}em`, width: `${itemWidth}em`, visiblity: 'hidden'}}></Box> }
            <Card
                sx={itemSx}
                ref={containerRef}
                variant="outlined"
                onWheel={modalScroll}
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
                            sx={{fontSize: expanded ? '1.5em' : null}}
                            variant="contained"
                        >
                            { buttonText }
                        </Button>
                    </Box>
                </Box>
            </Card>
        </Box>
    );
};
