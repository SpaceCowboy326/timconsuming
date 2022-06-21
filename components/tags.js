import React, { useState } from 'react';
import { Autocomplete, Box, Chip, IconButton, TextField } from '@mui/material';
import {AddCircleOutlined} from '@mui/icons-material';
import useSWR from 'swr';


const tagsFetcher = (url) => fetch(url).then((res) => res.json());

export default function Tags({setTags, tags, type, readOnly}) {
    const classes = {};
    const [tagName, setTagName] = useState('');
    const uniqueTags = useSWR(readOnly ? null : `/api/items/uniqueTags?itemType=${type}`, tagsFetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });

    tags = tags || [];

    const handleTagChange = (e, newValue) => {
        if (!e) return;
        setTagName(newValue || '');
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
        {!readOnly && <Box sx={{alignItems: 'center', display: 'flex', mb: 1}}>
            <Autocomplete
                color="tertiary"
                disablePortal
                onChange={handleTagChange}
                onInputChange={handleTagChange}
                options={uniqueTags.data || []}
                value={tagName}
                inputValue={tagName}
                variation="outlined"
                sx={{ width: 300 }}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        label="Tags"
                        onKeyUp={e => handleTagTextFieldKeyUp(e)}
                        variant="outlined"
                    />
                }
            />
            <IconButton onClick={enterCurrentTagName}  sx={{ml: 1}}>
                <AddCircleOutlined sx={{color: '#3f51b5',fontSize: '3em'}} />
            </IconButton>
        </Box>}
        <Box sx={{flexBasis: '100%'}}>
            {tags.map((tag, index) =>
                <Chip
                    color="secondary"
                    key={`tag_${index}`}
                    label={tag}
                    onDelete={readOnly ?  null : () => handleDeleteTag(tag)}
                    sx={{bgcolor: '#3f51b5', height: '1.75rem', fontSize: '1.15rem', mr: 1, mb: 1}}
                />
            )}
        </Box>
    </Box>;
}