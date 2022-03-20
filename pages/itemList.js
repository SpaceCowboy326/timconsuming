import * as React from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { DataGrid } from '@mui/x-data-grid';

import {getItems} from '../lib/item/items';

const dataGridSx = {
    '.MuiDataGrid-columnHeader': {
        bgcolor: 'primary.main',
    },
    '.MuiDataGrid-cell': {
        bgcolor: '#c7c7c7',
    }
}

const columns = [
    {
        field: 'name',
        headerName: 'Name',
        // headerAlign: 'center',
        flex: 1,
        renderCell: (params) =>
            <Link
                underline="hover"
                target="_blank"
                sx={{color: 'tertiary.main'}}
                rel="noopener noreferrer"
                href={`/addItem?id=${params.row._id}`}
                title="Item Detail Page"
            >
                {params.row.name}
            </Link>
    },
    {field: 'type', headerName: 'Type', flex: 1},
    {field: 'subType', headerName: 'Sub-Type', flex: 1},
    {field: 'source', headerName: 'Source', flex: 1},
    {field: '_id', headerName: 'ID', flex: 1},
];

export default function ItemList({itemList}) {
    itemList.forEach((item,index) => item.id = index);
    console.log({itemList});
    return (<Box sx={{height: '100%', width: '100%'}}>
        <DataGrid
            autoHeight
            rows={itemList}
            columns={columns}
            disableSelectionOnClick
            pageSize={50}
            sx={dataGridSx}
            rowsPerPageOptions={[50]}
        />
    </Box>);

}


export async function getServerSideProps(ctx) {
    const itemList = await getItems();
	// console.log("What did we find from DB?", initialItems);
    return {
        props: {itemList},
    }
}

