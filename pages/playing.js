import React, { useState, useEffect, useContext } from 'react';
import {getItems} from '../lib/item/items';
import TypeDisplay from '../components/typeDisplay';
import { ConstructionOutlined } from '@mui/icons-material';

// const items = allItems.items;

export default function Playing({initialItems}) {
    console.log({initialItems});
    // const itemData = useItemData('Beverage');
    const itemData = {};
    // console.log("INITIAL ITEM DATA", initialItems);
    // console.log("ItemData is... anything?", itemData);
    // console.log("ItemData data is...", itemData.data);

    return <TypeDisplay type="game" data={initialItems}></TypeDisplay>;
}


export async function getServerSideProps(context) {
    const initialItems = await getItems('Game');
	// console.log("What did we find from DB?", initialItems);
    return {
        props: { initialItems },
    }
}
