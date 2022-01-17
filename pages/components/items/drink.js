import Image from 'next/image'
import React, { useState, useEffect, useRef } from 'react';
// import styles from '../styles/Home.module.css'
import { Backdrop, Grid, Button, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import styles from '../../../styles/drink.module.scss';
import itemStyles from '../../../styles/item.module.scss';

export default function Drink({data, toggleExpanded}) {
    const [count, setCount] = useState(0);

    return (
        <div className={styles.drink}>
            <div className={styles.itemImage}>
                {
                    data.imageUrl &&
                    <Image
                        layout="fill"
                        objectFit="cover"
                        objectPosition={data.objectPosition}
                        // height={300}
                        // width={200}
                        src={data.imageUrl}
                    />
                }
            </div>

            <div className={styles.itemTitle}>
                <Typography variant="body2" className={styles.title} gutterBottom>
                    {data.name}
                </Typography>
            </div>

            <Typography className={styles.source} color="textSecondary">
                {data.source}
            </Typography>
            <Typography variant="body2" className={styles.source} color="textSecondary">
                Style: {data.style}
            </Typography>
            <div className={styles.buttonRow}>
                <div className={styles.actionButtonContainer}>
                    <Button
                        classes={{root: styles.actionButton, label: styles.actionButtonLabel}}
                        fullWidth={true}
                        onClick={toggleExpanded}
                        className={styles.actionButton}
                        variant="contained"
                    >
                        Tell Me More
                    </Button>
                </div>
            </div>
        </div>
);
};
