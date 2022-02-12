import { useState, useEffect } from 'react';
import useSWR from 'swr';

const itemsFetcher = (url) => fetch(url).then((res) => res.json());

export function useItemData(type) {
    const itemData = useSWR(`/api/items?itemType=${type}`, itemsFetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });
    return itemData;
}