import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState, useEffect, useContext } from 'react';
// import styles from '../styles/Home.module.css'
import { Button, Typography, Fade } from '@material-ui/core';

import styles from '../../styles/index.module.scss';
const selected_class = `${styles.navItem} ${styles.selectedItem}`;
const previously_selected_class = `${styles.navItem} ${styles.previousSelectedItem}`;

const PAGE_NAMES = ['drinking', 'watching', 'listening', 'playing'];
const PAGE_TO_TEXT = {
    drinking: 'Drinking',
    listening: 'Listening To',
    playing: 'Playing',
    watching: 'Watching',
};

const getNavItemClasses = ({pageName, selectedPage, previous}) => {
    // start with default classes
    const navItemClasses = [styles.navItem];
    if (selectedPage === pageName) {
        navItemClasses.push(styles.selectedItem);
    }
    if (previous === pageName) {
        navItemClasses.push(styles.previousSelectedItem);
    }
    return navItemClasses.join(" ");
}

const LayoutContext = React.createContext(themes.light);


export default function Layout({children, selectedPage}) {
    const router = useRouter();
    const {previous} = router.query;
    const [previousAction, setPreviousAction] = useState(previous);
    const [actionAnimationEnded, setActionAnimationEnded] = useState(!previous);


    const handlePreviousPageTitleAnimation = e => {
        console.log("action anim ended!");
        setActionAnimationEnded(true);
    }

    // Create navItem list
    const nav = (<div className={styles.nav}>
        {
            PAGE_NAMES.reduce((list, pageName) => {
                // filter out the current action if the animation has ended
                // filter out the previous action if the animation is ongoing
                if (
                    (pageName === previous && !actionAnimationEnded) ||
                    (pageName === selectedPage && actionAnimationEnded)
                ) {
                    return list;
                }

                const navItemElem = (<div key={pageName} className={getNavItemClasses({pageName, selectedPage, previous})}>
                    <Typography variant="h6"><Link href={`/${pageName}?previous=${selectedPage}`}>{`${PAGE_TO_TEXT[pageName]}?`}</Link></Typography>
                </div>);
                list.push(navItemElem);
                return list;
            }, [])
        }
    </div>);

    const page_title_action_text = <div className={styles.pageTitleActionTextContainer}>
            { !actionAnimationEnded &&
                (<span onAnimationEnd={handlePreviousPageTitleAnimation} className={styles.previousPageTitleActionText}>
                    {(PAGE_TO_TEXT[previousAction])}?
                </span>) }
            { actionAnimationEnded &&
                <span className={styles.pageTitleActionText}>{(PAGE_TO_TEXT[selectedPage] || '...') + '?'}</span>
            }
        </div>;

    return (
    <div className={styles.container}>
        <Head>
        <title>TimConsuming</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        </Head>
        <div className={styles.main}>
            <Backdrop className={styles.backdrop} open={expanded} onClick={handleClose}>
                <div className={styles.pageTitle}>
                        <div className={styles.pageTitlePrefixContainer}>
                            <Typography className={styles.pageTitlePrefix} variant="h3">
                                What is Tim
                            </Typography>
                        </div>
                        <div className={styles.pageTitleSuffixContainer}>
                            <Typography className={styles.pageTitleSuffix} variant="h3">
                                {page_title_action_text}
                            </Typography>
                        </div>
                </div>
                {nav}
                {children}
            </Backdrop>
        </div>
        <footer >
            {/* <Link href="/drinking">who the hell is Tim?</Link> */}
        </footer>
    </div>
    );
}
