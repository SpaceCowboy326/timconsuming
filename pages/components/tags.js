import React, { useState } from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import { Autocomplete, Box, Chip, IconButton, TextField } from '@mui/material';
// import { Grid, Button, Typography, Backdrop } from '@mui/material';
import {AddCircleOutlined} from '@mui/icons-material';
import useSWR from 'swr';


const tagsFetcher = (url) => fetch(url).then((res) => res.json());

export default function Tags({setTags, tags, type}) {
    // const classes = useStyles();
    const classes = {};
    const [tagName, setTagName] = useState(null);
    const uniqueTags = useSWR(`/api/items/uniqueTags?itemType=${type}`, tagsFetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });
    if (uniqueTags.data) {
        console.log("UNIQUE TAGS:", uniqueTags.data);
    }
    else {
        console.log("No tags yet...");
    }

    tags = tags || [];

    const handleTagChange = e => {
        const value = e.target.value;
        setTagName(value);
    };

    const enterCurrentTagName = () => {
        if (!tagName) {
            return;
        }
        const newTagList = [...tags, tagName];
        setTags(newTagList);
        setTagName('');
    }

    const handleTagTextFieldKeyUp = (e) => {
        if (e.key === 'Enter') {
            enterCurrentTagName();
        }
    };

    const handleDeleteTag = (tag) => {
        const removeIndex = tags.indexOf(tag);
        if (removeIndex < 0) {
            console.warn("Attempting to remove invalid tag.");
            return;
        }

        const newTagList = [...tags];
        newTagList.splice(removeIndex, 1);
        setTags(newTagList);
    };

    return <Box sx={{alignItems: 'center',  display: 'flex', flexWrap: 'wrap'}}>
        <Autocomplete
            color="tertiary"
            disablePortal
            options={uniqueTags.data || []}
            value={tagName}
            variation="outlined"
            sx={{ width: 300 }}
            renderInput={(params) =>
                <TextField
                    {...params}
                    label="Tags"
                    onKeyUp={e => handleTagTextFieldKeyUp(e)}
                    onChange={handleTagChange}
                    variant="outlined"
                />
            }
        />
        <IconButton onClick={enterCurrentTagName}  sx={{ml: 1}}>
            <AddCircleOutlined sx={{color: '#3f51b5',fontSize: '3em'}} />
        </IconButton>
        <Box sx={{mt: 1, flexBasis: '100%'}}>
            {
                tags.map((tag, index) =>
                    <Chip
                        color="secondary"
                        key={`tag_${index}`}
                        label={tag}
                        onDelete={e => handleDeleteTag(tag)}
                        sx={{bgcolor: '#3f51b5', fontSize: '1.25em', mr: 1}}
                    />
                )
            }
        </Box>
    </Box>;
}