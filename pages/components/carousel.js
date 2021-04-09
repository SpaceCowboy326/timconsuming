import Head from 'next/head'
import React, { useState, useEffect, useRef, useMemo } from 'react';
// import styles from '../styles/Home.module.css'
import { Grid, Button, Typography } from '@material-ui/core';
import Item from './item';
import styles from '../../styles/carousel.module.scss';


export default function Carousel({items}) {
    const [scrolling, setScrolling] = useState(false);
    const [dragStartPageX, setDragStartPageX] = useState(0);
    const [dragStartScrollX, setDragStartScrollX] = useState(0);
    const [scrollX, setScrollX] = useState(0);
    // const [gridItems, setGridItems] = useState(null);

    const [addRemoveMouseUpListener, setAddRemoveMouseUpListener] = useState(false);
    const containerRef = useRef(null)


    const itemList = useMemo(() => 
        items.map(item => (
            <Grid key={item.id} item s={12}>
                <Item data={item} />
            </Grid>
        )), [items]
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

    // TODO - maybe attach this to window? not sure it's necessary
    const handleMouseMove = e => {
        // console.log(`X: ${e.pageX} Y: ${e.pageY}`);
        if (scrolling) {
            const difference = (e.pageX - dragStartPageX) * 2;
            const currentScrollX = dragStartScrollX + difference;
            // console.log("diff is", difference);
            setScrollX(currentScrollX);
        }
    };

    // const gridItems = (items.map(item => (
    //     <Grid key={item.id} item s={12}>
    //         <div className={styles.item}>Item: {item.name}
    //             <Item data={item} />
    //         </div>
    //     </Grid>
    // )) );



    if (containerRef && scrollX) {
        containerRef.current.scrollLeft = scrollX * -1;
    }

    // const containerStyles = {scrollLeft: scrollX};

    return (<div className={styles.container} ref={containerRef}>
        <Grid container spacing={3} wrap="nowrap" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} >
            {itemList}
        </Grid>
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