import Head from 'next/head'
import React, { useState, useEffect, useRef, useMemo } from 'react';
// import styles from '../styles/Home.module.css'
import { Grid, Button, Typography, Backdrop } from '@material-ui/core';
import Item from './item';
import styles from '../../styles/carousel.module.scss';


export default function Carousel({items}) {
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
                <Item data={item} backdropShown={showBackdrop} displayBackdrop={setBackdropDisplay} />
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
        console.log("What is this", this)
    };

    const handleBackdropClick = e => {
        setShowBackdrop(false);
        if (typeof backdropClickCallback === 'function') {
            backdropClickCallback();
        }
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
                console.log("setting pos...", currentScrollX);
                setScrollX(currentScrollX);
            }
        }
    };

    if (containerRef && scrollX) {
        containerRef.current.scrollLeft = scrollX * -1;
    }


    return (<div className={styles.container} ref={containerRef}>
        <Grid container spacing={3} wrap="nowrap" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} >
            {itemList}
        </Grid>
        <Backdrop style={backdropStyles} onClick={handleBackdropClick} open={showBackdrop}/>
    </div>);
};


{/* <Card className={classes.root} variant="outlined">
    <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
            Word of the Day
        </Typography>
        <Typography variant="h5" component="h2">
            be{bull}nev{bull}o{bull}lent
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
            adjective
        </Typography>
        <Typography variant="body2" component="p">
            well meaning and kindly.
            <br />
            {'"a benevolent smile"'}
        </Typography>
    </CardContent>
    <CardActions>
        <Button size="small">Learn More</Button>
    </CardActions>
</Card> */}