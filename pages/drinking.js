import React, { useState, useEffect, useContext } from 'react';
import {getItems} from '../lib/item/items';
import TypeDisplay from '../components/typeDisplay';

export default function Drinking({initialItems}) {
    return <TypeDisplay type="Beverage" data={initialItems}></TypeDisplay>;
}


export async function getServerSideProps(context) {
    const initialItems = await getItems('Beverage');
    return {
        props: { initialItems },
    }
}
