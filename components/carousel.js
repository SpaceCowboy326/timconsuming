import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Backdrop, Box, Grid } from '@mui/material';
import Item from './item/item';
import { keyframes } from '@mui/system';
import { alpha } from "@mui/material";
import {ChevronLeft, ChevronRight} from './chevron'

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

const backdropSx = {
	opacity: 0.5,
	zIndex: 1000,
};

const outerArrowSx = {
    animation: `${outerArrowEffect} 3s infinite`,
	display: 'flex',
    width: '4em',
};

const innerArrowSx = {
    animation: `${innerArrowEffect} 3s infinite`,
	display: 'flex',
    position: 'absolute',
    width: '3em',
    '&.innerChevronLeft': {
        right: '0',
    },
    '&.innerChevronRight': {
        left: '.5em',
    }
};

const scrollContainerSx = {
	alignItems: 'center',
    cursor: 'pointer',
	display: 'flex',
	height: '100%',
    width: '5em',
    overflow: 'hidden',
    opacity: {
        xs: 1,
        md: 0,
    },
    position: 'relative',
    transition: 'opacity 1s',
    '& svg': {
        fill: (theme) => theme.palette.secondary.main,
        transition: 'fill .75s',
        stroke: (theme) => theme.palette.textSecondary,
    },
    '&:hover svg': {
        fill: (theme) => theme.palette.secondary.dark,
    },
    '&.scrollContainerLeft': {
        justifyContent: 'flex-start',
    },
    '&.scrollContainerRight': {
        justifyContent: 'flex-end',
    }
};

export default function Carousel({items, actions, type, category}) {
    const [scrolling, setScrolling] = useState(false);
    const [dragStartPageX, setDragStartPageX] = useState(0);
    const [dragStartScrollX, setDragStartScrollX] = useState(0);
    const [scrollX, setScrollX] = useState(0);
    const [showBackdrop, setShowBackdrop] = useState(false);
    const [backdropClickCallback, setBackdropClickCallback] = useState(null);

    const containerRef = useRef(null)
    const itemList = useMemo(() => 
        items.map(item => (
            <Grid key={`${category}_${type}_${item._id}`} item s={12}>
                <Item
                    actions={actions}
                    backdropShown={showBackdrop}
                    data={item}
                    displayBackdrop={setShowBackdrop}
                    type={type}
                />
            </Grid>
        )), [items, showBackdrop, actions, category, type]
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
    }, [scrolling, handleScrollingEnd]);

    const handleScrollingStart = useCallback((e) => {
        setScrolling(true);
        setDragStartPageX(e.pageX || e.touches?.[0]?.screenX);
        setDragStartScrollX(scrollX);
        e.preventDefault();
    }, [setScrolling, setDragStartPageX, setDragStartScrollX, scrollX]);

    const handleScrollingEnd = useCallback((e) => {
        window.removeEventListener('mouseup', handleScrollingStart);
        window.removeEventListener('touchend', handleScrollingStart);
        setScrolling(false);
    }, [setScrolling, handleScrollingStart]);

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
                    className={'scrollContainer scrollContainerLeft'}
				>
					<Box sx={{...outerArrowSx}}>
                        <ChevronLeft fill={'yellow'} className={'outerChevronLeft'}></ChevronLeft>
					</Box>
					<Box sx={{...innerArrowSx}} className={'innerChevronLeft'}>
                        <ChevronLeft></ChevronLeft>
					</Box>
				</Box>
			</Box>
			<Box
				sx={{
					cursor: 'grab',
					overflow: 'hidden',
                    p: '1.25em 1em',
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
                    className={'scrollContainer scrollContainerRight'}
				>
					<Box sx={{...innerArrowSx}} className={'innerChevronRight'}>
                        <ChevronRight></ChevronRight>
					</Box>
					<Box sx={{...outerArrowSx}} className={'outerChevronRight'}>
                        <ChevronRight></ChevronRight>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};