import React, { useState, useEffect, useContext } from 'react';
import {useItemData} from '../lib/util';
import {getItems} from '../lib/item/items';
import TypeDisplay from '../components/typeDisplay';

// const items = allItems.items;

export default function Drinking({initialItems}) {
    // const itemData = useItemData('Beverage');
    const itemData = {};
    // console.log("INITIAL ITEM DATA", initialItems);
    // console.log("ItemData is... anything?", itemData);
    // console.log("ItemData data is...", itemData.data);

    return <TypeDisplay type="Beverage" data={initialItems}></TypeDisplay>;
}


export async function getServerSideProps(context) {
    const initialItems = await getItems('Beverage');
	// console.log("What did we find from DB?", initialItems);
    return {
        props: { initialItems },
    }
}
