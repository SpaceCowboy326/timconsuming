import React from 'react';
import {getItems} from '../lib/item/items';
import TypeDisplay from '../components/typeDisplay';

export default function Watching({initialItems}) {
    return <TypeDisplay type="media" data={initialItems || []}></TypeDisplay>;
}

export async function getServerSideProps(context) {
    const initialItems = await getItems('Media');
    return {
        props: { initialItems },
    }
}
