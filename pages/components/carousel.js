import Head from 'next/head'
import React, { useState, useEffect, useRef, useMemo } from 'react';
// import styles from '../styles/Home.module.css'
import { Grid, Button, Typography, Backdrop } from '@mui/material';
import Item from './item';
import styles from '../../styles/carousel.module.scss';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';

const MIN_SCROLL_INCREMENT = 288;

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
    const backdropStyles = {
        opacity: 0.5,
        zIndex: 1000,
    };

    //TODO - not sure if it's necessary to wrap or if you should pass state setters directly?
    const setBackdropDisplay = ({val, clickCallback}) => {
        setShowBackdrop(val);
        // setBackdropClickCallback(clickCallback);
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

    return (<div className={styles.outerContainer}>
        <div className={styles.fadedEdgeLeft}></div>
        <div className={`${styles.scrollContainer} ${styles.leftScrollContainer}`}>
            {/* <DoubleArrowIcon fontSize={'large'}></DoubleArrowIcon> */}
            <div onClick={() => scroll(true)} className={styles.icon}>
                <div className={styles.arrow}></div>
                <div className={styles.arrow2}></div>
            </div>
        </div>
        <div className={styles.transparentEdgeViewportOverlay}></div>
        <div className={styles.viewport} ref={containerRef}>
            <Grid classes={{root: styles.gridContainer}} container spacing={3} wrap="nowrap" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} >
                {itemList}
            </Grid>
            <Backdrop style={backdropStyles} onClick={handleBackdropClick} open={showBackdrop}/>
        </div>
        <div className={`${styles.scrollContainer} ${styles.rightScrollContainer}`}>
            {/* <DoubleArrowIcon fontSize={'large'}></DoubleArrowIcon> */}
            <div onClick={() => scroll(false)} className={styles.icon}>
                <div className={styles.arrow}></div>
                <div className={styles.arrow2}></div>
            </div>
        </div>
        <div className={styles.fadedEdgeRight}></div>
    </div>);
};