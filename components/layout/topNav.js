import Image from 'next/image'
import { useRouter } from 'next/router'
import { keyframes, styled } from '@mui/system';
import React, { useCallback } from 'react';
import { Box, Link } from '@mui/material';
const fadeAnimationDuration = 350;

const PAGE_NAMES = ['drinking', 'watching', 'listening', 'playing'];
const navPopEffect = keyframes`
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
`;

const navImages = {
    drinking: '/images/002-alcohol.svg',
    listening: '/images/headphone.svg',
    playing: '/images/gamepad.svg',
    watching: '/images/laptop.svg',
};

const getNavItemSx = ({pageName, selectedPage}) => {
    let width = 5;
    const sx = {
        cursor: 'pointer',
        transition: 'width .5s linear, margin .5s linear',
        transform: 'scale(1.0)',
        '&:not(:last-child)': {
            mr: 5,
        },
    };

    if (pageName === 'listening') {
        width = 4;
        sx.pt = '0.25rem';
    }
    if (selectedPage !== pageName) {
        sx['&:hover:not(.selectedItem)'] = {
            animation: `${navPopEffect} 0.75s ease-in-out both`,
        };
    }
    else {
        width += 2;
        sx.mt = '-1rem';
    }
    sx.width = `${width}rem`;
     
    return sx;
};

const StyledContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    height: '7rem',
    justifyContent: 'center',
    padding: '1rem 0',
}));

function TopNav({selectedPage, setTransition}) {
    const router = useRouter();

    // Click handler for nav items
    const handleActionClick = useCallback(({e, nextPage, currentPage}) => {
        e.preventDefault();
        if (nextPage === currentPage) {
            return;
        }
        setTransition(false);
        const navTimer = setTimeout(() => {
            router.push(`/${nextPage}`);
        }, fadeAnimationDuration);
        return () => clearTimeout(navTimer);
    }, [router, setTransition]);

    return <StyledContainer>
        { PAGE_NAMES.map((pageName) => (
            <Box
                key={pageName}
                sx={getNavItemSx({pageName, selectedPage})}
            >
                <Link
                    aria-label={`Navigate to ${pageName} page`}
                    href={`/${pageName}`}
                    onClick={e => handleActionClick({e, nextPage: pageName, currentPage: selectedPage})}
                >
                    <Image
                        alt={`Navigate to ${pageName}`}
                        layout="responsive"
                        height={100}
                        width={100}
                        src={navImages[pageName]}
                    />
                </Link>
            </Box>
        ))}
    </StyledContainer>;
}
export default TopNav;