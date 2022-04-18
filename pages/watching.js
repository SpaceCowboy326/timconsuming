import React from 'react';
import {getItems} from '../lib/item/items';
import TypeDisplay from '../components/typeDisplay';

export default function Watching({initialItems}) {
    console.log({initialItems});
    const itemData = {};
    
    return <TypeDisplay type="media" data={initialItems || []}></TypeDisplay>;
}

export async function getServerSideProps(context) {
    const initialItems = await getItems('Media');
    return {
        props: { initialItems },
    }
}
