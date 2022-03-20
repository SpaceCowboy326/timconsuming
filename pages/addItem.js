import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
// import Tags from '../components/tags';
import Tags from '../components/tags';
import { Autocomplete, Box, Button, Typography, Paper, InputLabel, Input, TextField, Select, Slider, MenuItem, FormControl } from '@mui/material';
import unitedStatesLocations from '../data/unitedStatesLocations.json';
import countries from '../data/countries.json';
import React, { useState, useCallback, useMemo,} from 'react';
import {getItem} from '../lib/item/items';

const UNITED_STATES = 'United States of America';
const ITEM_TYPES = [
    'Beverage',
    'Game',
    'Media',
];

const FIELD_DEFAULTS = {
    CITY:           '',
    COUNTRY:        UNITED_STATES,
    DESCRIPTION:    '',
    NAME:           '',
    NAME_URL:       '',
    RATING:         5,
    SOURCE:         '',
    SOURCE_URL:     '',
    STATE:          '',
    SUBTYPE:        '',
    TYPE:           'Beverage',
};

const ITEM_ENDPOINT = '/api/item';
const ADD_IMAGE_ENDPOINT = '/api/items/addImage';

const tagsFetcher = (url) => fetch(url).then((res) => res.json());
const stateOptions = Object.keys(unitedStatesLocations).sort();

export default function AddItem({initialData = {}}) {
    const [type, setType] = useState(initialData.type || FIELD_DEFAULTS.TYPE);
    const [subType, setSubType] = useState(initialData.subType || 'Beer');
    const [name, setName] = useState(initialData.name || FIELD_DEFAULTS.NAME);
    const [nameUrl, setNameUrl] = useState(initialData.nameUrl || FIELD_DEFAULTS.NAME_URL);
    const [source, setSource] = useState(initialData.source || FIELD_DEFAULTS.SOURCE);
    const [sourceUrl, setSourceUrl] = useState(initialData.sourceUrl || FIELD_DEFAULTS.SOURCE_URL);
    const [description, setDescription] = useState(initialData.description || FIELD_DEFAULTS.DESCRIPTION);
    const [imageFile, setImageFile] = useState(null);
    const [initialImageUrl, setInitialImageUrl] = useState(initialData.imageUrl);
    const [imagePreviewSrc, setImagePreviewSrc] = useState(initialData.imageUrl);
    const [tags, setTags] = useState(initialData.tags || []);
    const [city, setCity] = useState(initialData.city || FIELD_DEFAULTS.CITY);
    const [state, setState] = useState(initialData.state || FIELD_DEFAULTS.STATE);
    const [country, setCountry] = useState(initialData.country || FIELD_DEFAULTS.COUNTRY);
    const [rating, setRating] = useState(initialData.rating || FIELD_DEFAULTS.RATING);
    const [editId, setEditId] = useState(initialData._id);

    // Assemble the city options/
    const cityOptions = useMemo(() => unitedStatesLocations[state]?.sort() || [], [state, country]);

    const handleUploadImage = (e, b) => {
        const files = e?.target?.files;
        if (files && files.length) {
            const image = files[0];
            setImageFile(image);
            setImagePreviewSrc(URL.createObjectURL(image));
        }
    }

    // Sends the image data to the server, returns the reponse.
    const uploadImageToServer = useCallback(async () => {
        const body = new FormData();
        body.append("file", imageFile);
        const response = await fetch(ADD_IMAGE_ENDPOINT, {
            method: "POST",
            body
        });
        return response;
    }, [imageFile]);


    const resetForm = () => {
        setCity(FIELD_DEFAULTS.CITY);
        setCountry(FIELD_DEFAULTS.COUNTRY);
        setDescription(FIELD_DEFAULTS.DESCRIPTION);
        setName(FIELD_DEFAULTS.NAME);
        setNameUrl(FIELD_DEFAULTS.NAME_URL);
        setRating(FIELD_DEFAULTS.RATING);
        setState(FIELD_DEFAULTS.STATE);
        setSource(FIELD_DEFAULTS.SOURCE);
        setSourceUrl(FIELD_DEFAULTS.SOURCE_URL);
        setSubType(FIELD_DEFAULTS.SUBTYPE);
        setTags([]);
        // setType(FIELD_DEFAULTS.TYPE);

        setImageFile(null);
        setImagePreviewSrc(null);
    };

    const saveItem = async () => {
        let imageUrl = initialImageUrl;

        // If this is a new Item or a new Image has been uploaded, send it to the server.
        if (!imageUrl || imageFile) {
            const fileUploadResponse = await uploadImageToServer();
            if (fileUploadResponse?.status !== 200) {
                console.log("Failed response", fileUploadResponse);
            }
            const fileUploadJson = await fileUploadResponse.json();
            console.log("File Upload JSON", fileUploadJson);
            const imageFilename = fileUploadJson?.newFilename;
            imageUrl = `/images/items/${imageFilename}`;
        }
        const itemData = {
            city,
            country,
            description,
            imageUrl,
            name,
            nameUrl,
            rating,
            state,
            source,
            sourceUrl,
            subType,
            tags,
            type,
            id: editId,
        };
        const options = {
            body: JSON.stringify(itemData),
        };
        options.method = editId ? 'PUT' : 'POST';
        const saveUrl = editId ? `/api/items/${editId}` : '/api/items';
        console.log("saveUrl", saveUrl);
        const response = await fetch(saveUrl, options);
        if (response.status === 200) {
            resetForm();
        }
        console.log("Response", response);
    };

    const imagePreviewContent = useMemo(() => {
        return imagePreviewSrc ?
            <Image
                // layout="fill"
                height="800"
                width="800"
                objectFit="cover"
                src={imagePreviewSrc}
            />
            : null;
    }, [imagePreviewSrc]);

    const imageNameText = useMemo(() => {
        return imageFile ? 
            <Typography variant="h4" sx={{ml: 2, mt: .5}}>{imageFile.name}</Typography> :
            null;

    }, [imageFile])

    const imageRenameButton = useMemo(() => {
        return imageFile ?
            <Button sx={{fontSize: '1.5rem', height: 1, ml: 1}} type="Text" size="small" color="tertiary">{'<< Rename?'}</Button> :
            null;
    },[imageFile]);

    const handleTypeChange = e => {
        setType(e.target.value);
    };

    const handleSubTypeChange = e => {
        setSubType(e.target.value);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };
    const handleNameUrlChange = (e) => {
        setNameUrl(e.target.value);
    };
    const handleSourceUrlChange = (e) => {
        setSourceUrl(e.target.value);
    };
    const handleSourceChange = (e) => {
        setSource(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleRatingChange = (e, value) => {
        console.log("RATING CHANGE EVT", e);
        console.log("RATING CHANGE ... value?", value);
        setRating(e.target.value);
    }
    const handleCountryChange = e => setCountry(e.target.value || '');
    const handleStateChange = e => setState(e.target.value || '');
    const handleCityChange = (e, value) => setCity(value || '');

    return (
        <Box sx={{p:4}}>
            <Paper
                elevation={3}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    p: 4,
                    width: '95vw'
                }}
            >
                <FormControl>
                    <InputLabel id="type-label">Type</InputLabel>
                    <Select
                        color="tertiary"
                        labelId="type-label"
                        label="Type"
                        id="type"
                        sx={{
                            mb: 2,
                            width: '20em',
                        }}
                        value={type}
                        onChange={handleTypeChange}
                    >
                        { ITEM_TYPES.map(type => <MenuItem key={type} value={type}>{type}</MenuItem> ) }
                    </Select>
                </FormControl>
                { type &&
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '80vw',
                        }}
                    >
                        <Typography color="textSecondary" sx={{mb: 2}} variant={'h5'}>Add new {type && type.toString()}:</Typography>
                        <FormControl>
                            <TextField
                                id="item_subtype"
                                // fullWidth={true}
                                label="Sub-Type"
                                onChange={handleSubTypeChange}
                                placeholder="More specifically? e.g. Beer, Cocktail..."
                                sx={{mb: 2}}
                                value={subType}
                                variant="outlined"
                                color="tertiary"
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                id="item_name"
                                // fullWidth={true}
                                label="Name"
                                onChange={handleNameChange}
                                placeholder="What should we call it?"
                                sx={{mb: 2}}
                                value={name}
                                variant="outlined"
                                color="tertiary"
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                id="name_url"
                                // fullWidth={true}
                                label="External Link (Optional)"
                                onChange={handleNameUrlChange}
                                placeholder="External Link?"
                                sx={{mb: 2}}
                                value={nameUrl}
                                variant="outlined"
                                color="tertiary"
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                color="tertiary"
                                id="source"
                                label="Creator"
                                onChange={handleSourceChange}
                                placeholder="Who made it? e.g. company name, author name"
                                sx={{mb: 2}}
                                value={source}
                                variant="outlined"
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                color="tertiary"
                                id="source_url"
                                label="External Link (Optional)"
                                onChange={handleSourceUrlChange}
                                placeholder="External link?"
                                sx={{mb: 2}}
                                value={sourceUrl}
                                variant="outlined"
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                color="tertiary"
                                id="description"
                                label="Description"
                                multiline
                                onChange={handleDescriptionChange}
                                placeholder="What did you think of it?"
                                rows={3}
                                sx={{mb: 2}}
                                value={description}
                                variant="outlined"
                            />
                        </FormControl>
                        <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
                            <FormControl sx={{mr: 2}}>
                                <InputLabel id="country-label">Country</InputLabel>
                                <Select
                                    color="tertiary"
                                    label="Country"
                                    labelId="country-label"
                                    id="state"
                                    sx={{
                                        mb: 2,
                                        width: '20em',
                                    }}
                                    MenuProps={{ PaperProps: { sx: { maxHeight: '30em' } } }}
                                    value={country}
                                    onChange={handleCountryChange}
                                    variant="outlined"
                                >
                                    { countries.map(countryOption => <MenuItem key={`country_${countryOption}`} value={countryOption}>{countryOption}</MenuItem> ) }
                                </Select>
                            </FormControl>
                            { country && country === UNITED_STATES &&
                                <FormControl sx={{mr: 2}}>
                                    <InputLabel id="state-label">State</InputLabel>
                                    <Select
                                        // labelId="type-label"
                                        color="tertiary"
                                        label="State"
                                        labelId="state-label"
                                        id="state"
                                        MenuProps={{ PaperProps: { sx: { maxHeight: '30em' } } }}
                                        sx={{
                                            mb: 2,
                                            width: '20em',
                                        }}
                                        value={state}
                                        variant="outlined"
                                        onChange={handleStateChange}
                                    >
                                        { stateOptions.map(stateOption => <MenuItem key={`state_${stateOption}`} value={stateOption}>{stateOption}</MenuItem> ) }
                                    </Select>
                                </FormControl>
                            }
                            { cityOptions &&
                                <FormControl sx={{mr: 2}}>
                                    <Autocomplete
                                        color="tertiary"
                                        disablePortal
                                        options={cityOptions}
                                        value={city}
                                        onChange={handleCityChange}
                                        freeSolo
                                        inputValue={city}
                                        onInputChange={handleCityChange}
                                        sx={{ width: 300 }}
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                label="City"
                                                variant="outlined"
                                            />
                                        }
                                    />
                                </FormControl>
                            }
                        </Box>
                        <Box sx={{mb: 2}}>
                            <Tags tags={tags} type={type} setTags={setTags}></Tags>
                        </Box>
                        <Box sx={{mb: 2}}>
                            <InputLabel sx={{fontSize: '1.5em'}} id="rating-label">Rating (Let's Get Subjective!)</InputLabel>
                            <Slider
                                aria-label="Rating"
                                // valueLabelDisplay="auto"
                                defaultValue={rating}
                                onChange={handleRatingChange}
                                sx={{color: '#3f51b5', mt: 2}}
                                marks
                                min={1}
                                max={10}
                                valueLabelDisplay="on"
                            />
                        </Box>
                        <Box sx={{display: 'flex'}}>
                            <label htmlFor="item-image-file-input">
                                <Input onChange={handleUploadImage} sx={{display: 'none'}} accept="image/*" id="item-image-file-input" type="file" />
                                <Button variant="contained" component="span" color="secondary" sx={{fontSize: '1.5rem', mb: 2}}>
                                    Choose an Image
                                </Button>
                            </label>
                            {imageNameText}
                            {imageRenameButton}
                        </Box>
                        <Box sx={{
                            border: '1px solid grey',
                            minHeight: '5em',
                            mb: 2,
                        }}>
                            {imagePreviewContent}
                        </Box>
                        <Button
                            color="secondary"
                            sx={{
                                fontSize: '1.5rem',
                            }}
                            variant="contained"
                            onClick={saveItem}
                        >
                            Save
                        </Button>
                    </Box>
                }
            </Paper>
        </Box>
    );
}


export async function getServerSideProps(ctx) {
    const query = ctx.query;
    const pageProps = {};
    if (query.id) {
        const initialItem = await getItem({id: query.id});
        console.log("initialItem?", initialItem);
        initialItem._id = query.id;
        pageProps.initialData = initialItem;
    }
	// console.log("What did we find from DB?", initialItems);
    return {
        props: pageProps,
    }
}

