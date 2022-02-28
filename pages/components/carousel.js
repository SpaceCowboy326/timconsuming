import React, { useState, useEffect, useRef, useMemo } from 'react';
// import styles from '../styles/Home.module.css'
import { Backdrop, Box, Grid, SvgIcon } from '@mui/material';
import Item from './item';
import styles from '../../styles/carousel.module.scss';
import { flexbox, keyframes } from '@mui/system';
// import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import ChevronSvg from '../../public/images/chevron.svg;'
import Image from 'next/image';

const MIN_SCROLL_INCREMENT = 288;
const innerArrowSize = 5;
const outerArrowSize = 7;
const innerArrowWidth = 35;
const outerArrowWidth = 45;


const fadedEdgeSx = {
	background: (theme) => `linear-gradient(to right, ${theme.palette.primary.main} 0%, transparent 80%)`,
    height: '100%',
    pointerEvents: 'none',
    // position: 'absolute',
    transition: 'opacity 1s',
    width: '75px',
    zIndex: 999,
};

const backdropSx = {
	opacity: 0.5,
	zIndex: 1000,
};

const outerArrowSx = {
	alignContent: 'center',
	display: 'flex',
	// position: 'absolute',
	// left: '30px',
	height: '3em',
};

const innerArrowSx = {
	alignContent: 'center',
	// position: 'absolute',
	display: 'flex',
	height: '5em',
};

const scrollContainerSx = {
	alignContent: 'center',
	display: 'flex',
	height: '100%',
	position: 'relative',
};

export default function Carousel({items, actions, type}) {
    const [scrolling, setScrolling] = useState(false);
    const [dragStartPageX, setDragStartPageX] = useState(0);
    const [dragStartScrollX, setDragStartScrollX] = useState(0);
    const [scrollX, setScrollX] = useState(0);
    const [showBackdrop, setShowBackdrop] = useState(false);
    const [backdropClickCallback, setBackdropClickCallback] = useState(null);
    // const [gridItems, setGridItems] = useState(null);

    const [addRemoveMouseUpListener, setAddRemoveMouseUpListener] = useState(false);
    const containerRef = useRef(null)

    //TODO - not sure if it's necessary to wrap or if you should pass state setters directly?
    const setBackdropDisplay = ({val, clickCallback}) => {
        setShowBackdrop(val);
    };

    const itemList = useMemo(() => 
        items.map(item => (
            <Grid key={item.id} item s={12}>
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
            console.log("adding event listener");
            window.addEventListener('mouseup', handleMouseUp);
            // window.addEventListener('click', e => console.log("Click!", e));
        }
    }, [scrolling]);

    // const current_items = items || [];
    const handleMouseDown = e => {
        setScrolling(true);
        setDragStartPageX(e.pageX);
        setDragStartScrollX(scrollX);
        e.preventDefault();
        console.log("Starting scrolling at " + e.pageX);
    };

    const handleMouseUp = e => {
        window.removeEventListener('mouseup', handleMouseUp);
        setScrolling(false);
        console.log("Ending scrolling at " + e.pageX);
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
        console.log("scrollx", scrollX);
        console.log("offsetWidth", containerRef.current.offsetWidth);
        const scroll_increment = Math.max(containerRef.current.offsetWidth * 0.75, MIN_SCROLL_INCREMENT);
        console.log("scrollIncrement is", scroll_increment);
        const currentScroll = containerRef.current.scrollLeft;
        console.log("currentScroll is", currentScroll);
        const newScroll = left ? currentScroll - scroll_increment : currentScroll + scroll_increment;
        containerRef.current.scroll({top: 0, left: newScroll, behavior: 'smooth'});
        // Update the scrollX state only after the "smooth" scrolling finishes.
        // TODO - find a better solution.
        setTimeout(() => setScrollX(newScroll * -1), 500);
        // setScrollX(newScroll * -1);
    };

    // TODO - maybe attach this to window? not sure it's necessary
    const handleMouseMove = e => {
        // console.log(`X: ${e.pageX} Y: ${e.pageY}`);
        if (scrolling) {
            const difference = (e.pageX - dragStartPageX) * 2;
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
		<Box sx={{
			borderTop: '2px solid rgb(177, 173, 173, 0)',
			borderBottom: '2px solid rgb(177, 173, 173, 0)',
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
			}
		}}>
			<Box sx={{...fadedEdgeSx, translate: 'transformX(100%)'}}></Box>
			<Box
				mr={1}
			>
				<Box
					onClick={() => scroll(true)}
					sx={{
						...scrollContainerSx
					}}
				>
					<Box sx={{transform: 'rotate(180deg)', ...outerArrowSx}}>
						<img src={'images/chevron.svg'}></img>
						{/* <Image width={outerArrowWidth} height={100} src="/images/chevron.svg"></Image> */}
					</Box>
					<Box sx={{transform: 'rotate(180deg) translate(50%,0)', ...innerArrowSx}}>
						<img src={'images/chevron.svg'}></img>
						{/* <Image width={innerArrowWidth} height={100} src="/images/chevron.svg"></Image> */}
					</Box>
				</Box>
			</Box>
			<Box className={styles.transparentEdgeViewportOverlay}></Box>
			<Box
				sx={{
					cursor: 'grab',
					overflow: 'hidden',
					padding: '1.25rem 2rem',
					position: 'relative',
				}}
				ref={containerRef}
			>
				<Grid classes={{root: styles.gridContainer}} container spacing={3} wrap="nowrap" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} >
					{itemList}
				</Grid>
				<Backdrop sx={backdropSx} onClick={handleBackdropClick} open={showBackdrop}/>
			</Box>

			<Box
				ml={1}
			>
				<Box
					onClick={() => scroll(false)}
					sx={{...scrollContainerSx}}
				>
					<Box sx={innerArrowSx}>
						<img src={'images/chevron.svg'}></img>
						{/* <Image width={innerArrowWidth} height={100} src="/images/chevron.svg"></Image> */}
					</Box>
					<Box sx={outerArrowSx}>
						<img src={'/images/chevron.svg'}></img>
						{/* <Image width={outerArrowWidth} height={100} src="/images/chevron.svg"></Image> */}
					</Box>
				</Box>
			</Box>
			<Box sx={{...fadedEdgeSx, transform: 'translate(-100%), rotate(180deg)'}}></Box>
		</Box>
	);
};