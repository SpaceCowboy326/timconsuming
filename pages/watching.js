import React, { useState, useEffect, useContext } from 'react';
import {getItems} from '../lib/item/items';
import TypeDisplay from '../components/typeDisplay';


export default function Watching({initialItems}) {
    console.log({initialItems});
    const itemData = {};
    // console.log("INITIAL ITEM DATA", initialItems);
    // console.log("ItemData is... anything?", itemData);
    // console.log("ItemData data is...", itemData.data);
    
    return <TypeDisplay type="media" data={initialItems || []}></TypeDisplay>;
}


export async function getServerSideProps(context) {
    const initialItems = await getItems('Media');
	// console.log("What did we find from DB?", initialItems);
    return {
        props: { initialItems },
    }
}
