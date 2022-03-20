import Carousel from './carousel'
import { Box, Button, Typography, Paper } from '@mui/material';
import React, { useState, useEffect, useContext } from 'react';

// const items = allItems.items;
const categories = ['Beer', 'Cocktails', 'Non-Alcoholic'];

export default function TypeDisplay({data, type, actions}) {
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
						my: 3,
						py: 2,
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
