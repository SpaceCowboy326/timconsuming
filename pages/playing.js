import React from 'react';
import {getItems} from '../lib/item/items';
import TypeDisplay from '../components/typeDisplay';

export default function Playing({initialItems}) {
    return <TypeDisplay type="game" data={initialItems}></TypeDisplay>;
}

export async function getServerSideProps(context) {
    const initialItems = await getItems('Game');
    return {
        props: { initialItems },
    }
}
