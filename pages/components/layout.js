import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
// import auth from './lib/spotify/auth';
import auth from '../lib/spotify/auth'
import { createMuiTheme, ThemeProvider, createTheme } from '@material-ui/core/styles';
import React, { useState, useEffect, useContext } from 'react';
// import styles from '../styles/Home.module.css'
import { Button, Backdrop, Typography, Fade, Paper, Box, Slide } from '@material-ui/core';

// import avenirNextFont from '../../public/AvenirNextLTPro-Regular.otf';


import styles from '../../styles/index.module.scss';
const selected_class = `${styles.navItem} ${styles.selectedItem}`;
const previously_selected_class = `${styles.navItem} ${styles.previousSelectedItem}`;
// const fadeAnimationDuration = 1250;
// const fadeAnimationDuration = 750;
const fadeAnimationDuration = 1250;

const navImages = {
    drinking: '/images/002-alcohol.svg',
    listening: '/images/headphone.svg',
    playing: '/images/gamepad.svg',
    watching: '/images/laptop.svg',
};

const PAGE_NAMES = ['drinking', 'watching', 'listening', 'playing'];
const PAGE_TO_TEXT = {
    drinking: 'Drinking',
    listening: 'Listening To',
    playing: 'Playing',
    watching: 'Watching',
};

const getNavItemClasses = ({pageName, selectedPage, previous, transition}) => {
    // start with default classes
    const navItemClasses = [styles.navItem];
    if (selectedPage === pageName) {
        navItemClasses.push(styles.selectedItem);

        if (!transition) {
            navItemClasses.push(styles.selectedItem__out);
        }
        else {
            navItemClasses.push(styles.selectedItem__in);
        }
    }
    if (previous === pageName) {
        navItemClasses.push(styles.previousSelectedItem);
    }

    if (pageName === 'listening') {
        navItemClasses.push(styles.navItemListening)
    }
    return navItemClasses.join(" ");
}

// const bodyFont = "'Monoton', cursive"; NOPE
// const bodyFont = "'Prata', serif"; NOPE
// const bodyFont = "'EB Garamond', serif"; prolly not
// const bodyFont = "'Amatic SC', cursive;"; NOPE

// const bodyFont = "'Roboto'";
const bodyFont = "'Noto Sans SC', sans-serif;";
// const bodyFont = "'Rubik', sans-serif;";
// const bodyFont = avenirNextFont;
const theme = createTheme({
    typography: {
        // fontFamily: "'Rubik', sans-serif;", 
        // fontFamily: "'Amatic SC', cursive;", 
        // fontFamily: "'EB Garamond', serif",
        // fontFamily: "'Prata', serif",
        // fontFamily: "'Bungee Shade', cursive",
        // fontWeight: 700,
        // fontFamily: "'Noto Sans SC', sans-serif;",
        // fontFamily: "'Monoton', cursive",
        fontFamily: "'Bungee', cursive",
        h5: {
            lineHeight: '.8',
        },
        body1: {
            // fontFamily: "'Roboto'",
            fontFamily: bodyFont,
            fontWeight: 600,
        },
        body2: {
            // fontFamily: "'Roboto'",
            fontFamily: bodyFont,
        },
    },
    palette: {
        // type: "dark",
        // primary: {
        // main: '#b6c4f4',
        // },
        // secondary: {
        // main: '#f3d885',
        // },
    },
});

const SpotifyAuthContext = React.createContext({access_token: null, refresh_token: null});
export {SpotifyAuthContext};

const Layout = ({
    access_token,
    children,
    displayBackdrop = false,
    refresh_token,
    selectedPage,
}) => {
    const router = useRouter();
    const {previous} = router.query;
    const [transition, setTransition] = useState(true);
    const [slideDirection, setSlideDirection] = useState('up');
    useEffect(() => {
        setSlideDirection('up');
        setTransition(true);
    }, [selectedPage]);
console.log("Slide direction?", slideDirection);
console.log("transition?", transition);
    const footerFadeDuration = transition ? 3000 : 50;

    // Click handler for nav items
    const handleActionClick = (nextPage, currentPage) => {
        setTransition(false);
        console.log("nextPage is ", nextPage);
        const navTimer = setTimeout(() => {
            router.push(`/${nextPage}?previous=${currentPage}`);
        }, fadeAnimationDuration);


        return () => clearTimeout(navTimer);
    };

    // Create navItem list
    const nav = (<div className={styles.nav}>
        {
            PAGE_NAMES.reduce((list, pageName) => {
                const navItemElem = (
                    <div
                        key={pageName}
                        className={getNavItemClasses({pageName, selectedPage, previous, transition})}
                    >
                        <Image
                            onClick={e => handleActionClick(pageName, selectedPage)}
                            height={200}
                            width={200}
                            src={navImages[pageName]}
                        />
                    </div>
                );

                list.push(navItemElem);
                return list;
            }, [])
        }
    </div>);

    const page_title_action_text = <div className={styles.pageTitleActionTextContainer}>
                <span className={styles.pageTitleActionText}>{(PAGE_TO_TEXT[selectedPage] || '...') + '?'}</span>
        </div>;

    return (
        <ThemeProvider theme={theme}>
            {/* <SpotifyAuthContext.Provider value={{access_token, refresh_token}}> */}
                <div className={styles.container}>
                    <Head>
                        <title>TimConsuming</title>
                        <link rel="icon" href="/favicon.ico" />
                        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
                        <link href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@700&family=Noto+Sans+SC:wght@400;500&family=Zen+Dots&display=swap" rel="stylesheet" />

                        <link rel="preconnect" href="https://fonts.gstatic.com"/>
                        <link href="https://fonts.googleapis.com/css2?family=Baskervville&family=Bodoni+Moda&family=Bungee+Shade&family=EB+Garamond&family=Prata&display=swap" rel="stylesheet"/>
                        <link href="https://fonts.googleapis.com/css2?family=Bungee&family=Monoton&display=swap" rel="stylesheet"></link>
                        <script src="https://sdk.scdn.co/spotify-player.js"></script>
                    </Head>
                    <div className={styles.main}>
                            {/* <Paper className={styles.headerPaper} elevation={2}> */}
                                <div color="primary" className={styles.pageTitle}>
                                    <div className={styles.pageTitleContainer}>
                                        <div className={styles.pageTitlePrefixContainer}>
                                            <Typography className={styles.pageTitlePrefix} variant="h3">
                                                What is Tim
                                            </Typography>
                                        </div>
                                        <div className={styles.pageTitleSuffixContainer}>
                                            <Fade in={transition} timeout={fadeAnimationDuration}>
                                                <Typography className={styles.pageTitleSuffix} variant="h3">
                                                    {page_title_action_text}
                                                </Typography>
                                            </Fade>
                                        </div>
                                    </div>
                                </div>
                                {nav}
                            {/* </Paper> */}
                            {/* <Slide direction={slideDirection} in={transition} timeout={fadeAnimationDuration}> */}
                            <Fade  in={transition} timeout={fadeAnimationDuration}>

                                <div className={styles.contentContainer}>
                                    {children}
                                </div>
                            {/* </Slide> */}
                            </Fade>
                    </div>
                    <Fade in={transition} timeout={footerFadeDuration}>
                        <footer className={styles.footer}>
                            <Paper elevation={3} classes={{root: styles.footerPaper}}>
                                <div>
                                    <Typography variant="body2">
                                        Nav Icons made by <a target="_blank" rel="noopener noreferrer" href="https://www.freepik.com" title="Freepik">Freepik</a> from
                                        &nbsp;<a target="_blank" rel="noopener noreferrer" href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
                                    </Typography>
                                </div>
                            </Paper>
                            {/* <Link href="/drinking">who the hell is Tim?</Link> */}
                        </footer>
                    </Fade>
                </div>
            {/* </SpotifyAuthContext.Provider> */}
        </ThemeProvider>
    );
}

export async function getServerSideProps({req, res, query}) {
    const code = query.code;
    
    // const token_response = await fetch('http://localhost:3000/api/token');
    const token_response = await auth.getNewaccess_token(code);

    console.log("What's the token response?", token_response);
    // const json_token = await token_response.text();
    // console.log("What's the token json?", json_token);

    const {access_token, refresh_token, expires_in} = token_response;

    const props = {code};
    if (access_token) {
      props.access_token = access_token;
    }
    if (refresh_token) {
      props.refresh_token = refresh_token;
    }
    if (expires_in) {
      props.expires_in = expires_in;
    }
  
    return {
      props
    };
};

export default Layout;