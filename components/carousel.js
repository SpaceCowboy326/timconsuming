import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Backdrop, Box, Grid, SvgIcon } from '@mui/material';
import Item from './item/item';
import { flexbox, keyframes } from '@mui/system';
import { alpha } from "@mui/material";
import {ChevronLeft, ChevronRight} from './chevron'
import Image from 'next/image';

const innerArrowEffect = keyframes`
    0% {transform: translate(0, 0);}
    50% {transform: translate(-.3em, 0);}
    100% {transform: translate(0, 0);}
`;

const outerArrowEffect = keyframes`
    0% {transform: translate(0, 0);}
    10% {transform: translate(0, 0);}
    60% {transform: translate(.3em, 0);}
    75% {transform: translate(.4em, 0);}
    100% {transform: translate(0, 0);}
`;

const MIN_SCROLL_INCREMENT = 288;
const innerArrowSize = 5;
const outerArrowSize = 7;
const innerArrowWidth = 35;
const outerArrowWidth = 45;


// const fadedEdgeSx = {
// 	background: (theme) => `linear-gradient(to right, ${theme.palette.primary.main} 0%, transparent 200%)`,
//     height: '100%',
//     left: 0,
//     pointerEvents: 'none',
//     position: 'absolute',
//     top: 0,
//     transition: 'opacity 1s',
//     width: '75px',
//     zIndex: 999,
// };

const backdropSx = {
	opacity: 0.5,
	zIndex: 1000,
};

const outerArrowSx = {
    // top: '50%',
    animation: `${outerArrowEffect} 3s infinite`,
	display: 'flex',
	height: '3.5em',
    '.outerChevronLeft': {
        ml: '-.7em',

    },
    '.outerChevronRight': {
        
    }
};

const innerArrowSx = {
    animation: `${innerArrowEffect} 3s infinite`,
	display: 'flex',
	height: '3em',
    '.innerChevronLeft': {
        ml: '-2em',
        // left: '-2.8em',

    },
    '.innerChevronRight': {
        mr: '-2.5em',
    }
};

const scrollContainerSx = {
	alignContent: 'center',
	alignItems: 'center',
    cursor: 'pointer',
	display: 'flex',
	height: '100%',
    overflow: 'hidden',
    opacity: {
        xs: 1,
        md: 0,
    },
    // width: '4em',
    // position: 'relative',
    transition: 'opacity 1s',
    '& svg': {
        fill: (theme) => theme.palette.secondary.main,
        transition: 'fill .75s',
        stroke: (theme) => theme.palette.textSecondary,
    },
    '&:hover svg': {
        fill: (theme) => theme.palette.secondary.dark,
    }
    // 'img': {fill: 'red'},
};

export default function Carousel({items, actions, type, category}) {
    const [scrolling, setScrolling] = useState(false);
    const [dragStartPageX, setDragStartPageX] = useState(0);
    const [dragStartScrollX, setDragStartScrollX] = useState(0);
    const [scrollX, setScrollX] = useState(0);
    const [showBackdrop, setShowBackdrop] = useState(false);
    const [backdropClickCallback, setBackdropClickCallback] = useState(null);

    const containerRef = useRef(null)

    //TODO - not sure if it's necessary to wrap or if you should pass state setters directly?
    const setBackdropDisplay = ({val, clickCallback}) => {
        setShowBackdrop(val);
    };

    const itemList = useMemo(() => 
        items.map(item => (
            <Grid key={`${category}_${type}_${item._id}`} item s={12}>
                <Item
                    actions={actions}
                    backdropShown={showBackdrop}
                    data={item}
                    displayBackdrop={setBackdropDisplay}
                    type={type}
                />
            </Grid>
        )), [items, showBackdrop]
    );

    useEffect(() => {
        if (scrolling) {
            window.addEventListener('mouseup', handleScrollingEnd);
            window.addEventListener('touchend', handleScrollingEnd);
            return () => {
                window.removeEventListener('mouseup', handleScrollingEnd);
                window.removeEventListener('touchend', handleScrollingEnd);
            }
        }
    }, [scrolling]);

    const handleScrollingStart = e => {
        setScrolling(true);
        setDragStartPageX(e.pageX || e.touches?.[0]?.screenX);
        setDragStartScrollX(scrollX);
        e.preventDefault();
    };

    const handleScrollingEnd = e => {
        window.removeEventListener('mouseup', handleScrollingStart);
        window.removeEventListener('touchend', handleScrollingStart);
        setScrolling(false);
    };

    const handleBackdropClick = e => {
        setShowBackdrop(false);
        if (typeof backdropClickCallback === 'function') {
            backdropClickCallback();
        }
    };

    // Set 'left' to true to scroll left, falsy to scroll right.
    // TODO - set scroll increment relative to carousel/page width.
    const scroll = (left) => {
        const scroll_increment = Math.max(containerRef.current.offsetWidth * 0.75, MIN_SCROLL_INCREMENT);
        const currentScroll = containerRef.current.scrollLeft;
        const newScroll = left ? currentScroll - scroll_increment : currentScroll + scroll_increment;
        containerRef.current.scroll({top: 0, left: newScroll, behavior: 'smooth'});
        // Update the scrollX state only after the "smooth" scrolling finishes.
        // TODO - find a better solution.
        setTimeout(() => setScrollX(newScroll * -1), 500);
        // setScrollX(newScroll * -1);
    };

    const handleTouchStart = (e) => {
        setDragStartPageX(e.touches?.[0]?.screenX);
        setDragStartScrollX(scrollX);
    }

    const handleScrollDrag = e => {
        if (e.type === 'touchmove' || scrolling) {
            const value = e.pageX || e.touches?.[0]?.screenX
            const difference = (value - dragStartPageX) * 2;
            const currentScrollX = dragStartScrollX + difference;
            if (
                currentScrollX < 0 &&
                (currentScrollX > (containerRef.current.scrollWidth * -1))
            ) {
                setScrollX(currentScrollX);
            }
        }
    };

    if (containerRef && scrollX) {
        containerRef.current.scrollLeft = scrollX * -1;
    }

    return (
		<Box
            sx={{
                borderTop: '2px solid',
                borderBottom: '2px solid',
                // borderColor: 'secondary.main',
                borderColor: (theme) => alpha(theme.palette.secondary.main, 0),
                display: 'flex',
                minWidth: '18rem',
                position: 'relative',
                transition: 'border-color 0.5s linear',
                '&:hover': {
                    borderTop: '2px solid',
                    borderBottom: '2px solid',
                    borderColor: 'secondary.light',
                    '.scrollContainer': {
                        opacity: 1,
                    }
                },
                // overflow: 'hidden',
            }}
            onMouseDown={handleScrollingStart}
            onMouseMove={handleScrollDrag}
            onTouchStart={handleTouchStart}
            onTouchMove={handleScrollDrag}
        >
			<Box>

				<Box
					onClick={() => scroll(true)}
					sx={{
						...scrollContainerSx
					}}
                    className={'scrollContainer'}
				>
					<Box sx={{...outerArrowSx}}>
                        <ChevronLeft fill={'yellow'} className={'outerChevronLeft'}></ChevronLeft>
					</Box>
					<Box sx={{...innerArrowSx}}>
                        <ChevronLeft className={'innerChevronLeft'}></ChevronLeft>
					</Box>
				</Box>
			</Box>
			<Box
				sx={{
					cursor: 'grab',
					overflow: 'hidden',
                    py: '1.25em',
					position: 'relative',
				}}
				ref={containerRef}
			>
				<Grid
                    container
                    spacing={3}
                    wrap="nowrap"
                >
					{itemList}
				</Grid>
				<Backdrop sx={backdropSx} onClick={handleBackdropClick} open={showBackdrop}/>
			</Box>
			<Box
			>
				<Box
					onClick={() => scroll(false)}
					sx={{...scrollContainerSx}}
                    className={'scrollContainer'}
				>
					<Box sx={{...innerArrowSx}}>
                        <ChevronRight className={'innerChevronRight'}></ChevronRight>
					</Box>
					<Box sx={outerArrowSx} className={'outerChevronRight'}>
                        <ChevronRight></ChevronRight>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};