import Carousel from './carousel'
import { Box, Button, Typography, Paper } from '@mui/material';
import React, { useState, useEffect, useContext } from 'react';

// const items = allItems.items;
const categories = ['Beer', 'Cocktails', 'Non-Alcoholic'];
const MIN_TAGS = 4;


const getDataByFields = ({fields = [], data}) => {
	fields = [...fields];
	const field = fields.shift();
	const data_by_field_value = data.reduce((categorized_data, row) => {
		const value = row[field];
		if (!categorized_data[value]) {
			categorized_data[value] = [];
		}
		categorized_data[value].push(row);
		return categorized_data;
	}, {});

	if (fields.length) {
		const field_keys = Object.keys(data_by_field_value);
		field_keys.forEach(field_key => {
			data_by_field_value[field_key] = getDataByFields({fields: fields, data: data_by_field_value[field_key]});
		});
	}

	return data_by_field_value;
};

const getTagCounts = (data) => {
	return data.reduce((tagCounts, item) => {
		item.tags.forEach((tag) => tagCounts[tag] = tagCounts[tag] ? tagCounts[tag] + 1 : 1);
		return tagCounts;
	}, {});
};



const pickNTags = ({n, tagCounts, picked}) => {
	const tags = Object.keys(tagCounts).filter(tag => tagCounts[tag] >= MIN_TAGS);
	const weightedTags = tags.map((tag, index, arr) => {
		const previousValue = index > 0 ? arr[index - 1] : 0;
		return previousValue + tagCounts[tag];
	});
	console.log("weighted tags:", weightedTags);

	const randomLimit = weightedTags[ weightedTags.length - 1 ];
	const pickedNum = Math.floor(Math.random() * randomLimit);
	console.log("Picked Num:", pickedNum);
	let i = 0;
	while (weightedTags[i] < pickedNum) {
		i++;
	}
	picked.push(tags[i]);
	if (picked.length === n) {
		return picked;
	}
	else {
		delete tagCounts[tags[i]];
		return pickNTags({n, tagCounts, picked});
	}
};

export default function TypeDisplay({data, type, actions}) {
	useEffect(() => {
		const tagCounts = getTagCounts(data);
		console.log("tagCounts", tagCounts);
		const picked = [];
		const pickedTags = pickNTags({n: 3, tagCounts, picked});
		console.log("pickedTags", pickedTags);
	}, [data]);
	// const categorizedData = useMemo(() => {

	// }, data);
    // const itemData = useItemData('Beverage');
    const itemData = {};

    return (
		<Box sx={{
			display: 'flex',
			justifyContent: 'center',
			flexFlow: 'row wrap',
			width: '100%'
		}}>
			{categories.map((category, index) => (
				<Paper
					elevation={3}
					key={`${index}_category_display`}
					sx={{
						my: 3,
						p: 2,
						// color: 'textSecondary',
						// '&:hover': {bgColor: 'red'},
						'&:hover .sectionTitle': {
							color: "text.primary",
						},
						'&:first-of-type': {
							mt: 0,
						},
					}}
				>
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
						<Carousel category={category} actions={actions} type={type} items={data}/>
					</Box>
				</Paper>
			))}
		</Box>
    );
}
