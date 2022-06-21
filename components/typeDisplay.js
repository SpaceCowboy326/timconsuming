import Carousel from './carousel'

import { Box, IconButton, Typography, Paper, Tooltip } from '@mui/material';
import React, { useState, useEffect, useMemo } from 'react';
import { keyframes } from '@mui/system';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const MIN_TAGS = 4;
const addCategoryIconEffect = keyframes`
0%,
	100% {
		transform: translateY(0) rotate(0);
		transform-origin: 50% 50%;
	}
	15% {
		transform: translateY(-.32em) rotate(-6deg);
	}
	30% {
		transform: translateY(.16em) rotate(6deg);
	}
	45% {
		transform: translateY(-.16em) rotate(-3.6deg);
	}
	60% {
		transform: translateY(.08em) rotate(2.4deg);
	}
	75% {
		transform: translateY(-.04em) rotate(-1.2deg);
	}
`;

const getTagCounts = (data) => {
	return data.reduce((tagCounts, item) => {
		item.tags.forEach((tag) => tagCounts[tag] = tagCounts[tag] ? tagCounts[tag] + 1 : 1);
		return tagCounts;
	}, {});
};

const pickNTags = ({n, tagCounts, picked = []}) => {
	const tags = Object.keys(tagCounts).filter(
		tag => tagCounts[tag] >= MIN_TAGS && !picked.includes(tag)
	);
	let sum = 0,
		weightedTags = [];
	for (let tagIndex = 0; tagIndex < tags.length; tagIndex++) {
		const tag = tags[tagIndex];
		const count = Math.floor(tagCounts[tag] * 0.5);
		sum += count;
		weightedTags.push(sum);
	}

	const randomLimit = weightedTags[ weightedTags.length - 1 ];
	const pickedNum = Math.floor(Math.random() * randomLimit);
	let i = 0;
	while (weightedTags[i] < pickedNum) {
		i++;
	}
	picked.push(tags[i]);
	if (picked.length === n) {
		return picked;
	}
	else {
		return pickNTags({n, tagCounts, picked});
	}
};

function getIntersection(a, b) {
	const setB = new Set(b);
	return [...new Set(a)].filter(x => setB.has(x));
}

export default function TypeDisplay({categoryKey, data, type, actions, externalCategories, addCategory, removeCategory}) {
    const [typeCategories, setTypeCategories] = useState([]);
	useEffect(() => {
		if (!externalCategories) {
			const tagCounts = getTagCounts(data);
			const pickedTags = pickNTags({n: 3, tagCounts});
			setTypeCategories(pickedTags)
		}
	}, [data, externalCategories]);

	const categories = useMemo(() => externalCategories || typeCategories, [externalCategories, typeCategories]);
	const dataByCategory = useMemo(() => {
		if (!categories) {return null}
		const starterCategories = categories.reduce((acc, category) => {
			acc[category] = []
			return acc;
		}, {})
		return data.reduce((categorizedData, row) => {
			const categoryData = categoryKey ? row[ categoryKey ] : row.tags;
			const displayedTags = getIntersection(categoryData, categories);
			displayedTags.forEach(tag => categorizedData[tag].push(row));
			return categorizedData;
		}, starterCategories)
	}, [categories, categoryKey, data]);

	const handleAddCategoryClick = (e) => {
		const tagCounts = getTagCounts(data);
		const newPicked = pickNTags({n: typeCategories.length + 1, tagCounts, picked: typeCategories});
		setTypeCategories([...newPicked]);
	};

	const handleRemoveCategoryClick = (category, e) => {
		const removeIndex = typeCategories.indexOf(category);
		const newCategories = [...typeCategories];
		newCategories.splice(removeIndex, 1);
		setTypeCategories(newCategories);
	}

    return (
		<Box sx={{
			display: 'flex',
			flexFlow: 'row wrap',
			justifyContent: 'center',
			width: '100%'
		}}>
			{categories.map((category, index) => (
				<Paper
					elevation={3}
					key={`${type}_${category}_category_display`}
					sx={{
						my: '1em',
						p: {
							xs: '1em 0',
							md: '1em'
						},
                        borderRadius: {
                            xs: '0',
                            md: '4px',
                        },
						position: 'relative',
						'&:hover .sectionTitle': {
							color: "text.primary",
						},
						'&:first-of-type': {
							mt: 0,
						},
					}}
				>
					<Tooltip title="Remove Category">
					<IconButton
						aria-label={'Remove Category'}
						color="tertiary"
						sx={{
							cursor: 'pointer',
							position: 'absolute',
							right: {
								xs: '-.4em',
								md: '.5em',
							},
							transition: 'transform .25s ease-out',
							top: {
								xs: '-.4em',
								md: '.5em',
							},
							'&:hover': {
								transform: 'scale(1.2)',
							}
						}}
						onClick={(e) => {
							if (typeof removeCategory === 'function') {
								removeCategory(category, e);
							}
							else {
								handleRemoveCategoryClick(category, e);
							}
						}}
                    ><HighlightOffIcon sx={{fontSize: '2rem'}}/>
					</IconButton>	
					</Tooltip>
					<Typography
						color="textSecondary"
						className={'sectionTitle'}
						variant={'h5'}
						sx={{
							flex: '0 1 100%',
							ml: '.75em',
							transition: 'color 0.5s linear',
						}}
					>{category}:</Typography>
					<Box
						mt={1}
						sx={{
							// width: '93vw',
							width: {
								xs: '99vw',
								sm: '93vw',
							}
						}}
					>
						<Carousel
							actions={actions}
							category={category}
							items={dataByCategory[category]}
							type={type}
						/>
					</Box>
				</Paper>
			))}
			<Box
				sx={{
					cursor: 'pointer',
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
					py: '2em',
					// height: '5em',
					justifyContent: 'center',
					flexWrap: 'wrap',
					'&:hover .addCategoryText': {
						color: 'text.primary',
					},
					'&:hover .addCategoryIcon': {
						animation: `${addCategoryIconEffect} 2s infinite`
					}
				}}
				onClick={addCategory || handleAddCategoryClick}
			>
				<Typography sx={{transition: 'color 1s ease-out'}} color="textSecondary" className={'addCategoryText'} variant={'h5'}>
                    I&apos;d like to see what else you have
                </Typography>
				<Tooltip title="Add Category">
					<IconButton		
						aria-label="Add Category"
					>
						<AddCircleTwoToneIcon
							className={'addCategoryIcon'}
							color="secondary"
							sx={{fontSize: '2.5rem'}}
						/>
					</IconButton>
				</Tooltip>
			</Box>
		</Box>
    );
}
