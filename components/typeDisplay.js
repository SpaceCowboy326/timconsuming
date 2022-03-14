import Carousel from './carousel'
import { Box, Button, Typography, Paper } from '@mui/material';
// import allItems from '../pages/data/drinking.json';
// import styles from '../styles/drinking.module.scss';
import React, { useState, useEffect, useContext } from 'react';
// import {useItemData} from '../../lib/util';
// import {getItems} from '../../lib/item/items';

// const items = allItems.items;
const categories = ['Beer', 'Cocktails', 'Non-Alcoholic'];

export default function TypeDisplay({data, type}) {
    // const itemData = useItemData('Beverage');
    const itemData = {};
    // console.log("INITIAL ITEM DATA", data);
    // console.log("ItemData is... anything?", itemData);
    // console.log("ItemData data is...", itemData.data);

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
						m: 3,
						p: 2,
						// color: 'textSecondary',
						// '&:hover': {bgColor: 'red'},
						'&:hover .sectionTitle': {
							color: "text.primary",
						}
					}}
				>
					<Typography
						color="textSecondary"
						className={'sectionTitle'}
						variant={'h5'}
						sx={{
							flex: '0 1 100%',
							transition: 'color 0.5s linear',
						}}
					>{category}:</Typography>
					<Box
						mt={1}
						sx={{
							flex: '0 1 90%',
							width: '93vw',
						}}
					>
						<Carousel category={category} type={type} items={data}/>
					</Box>
				</Paper>
			))}
		</Box>
    );
}
