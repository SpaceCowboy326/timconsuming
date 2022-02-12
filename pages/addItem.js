import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
// import Tags from '../components/tags';
import Tags from './components/tags';
import { Autocomplete, Box, Button, Typography, Paper, InputLabel, Input, TextField, Select, Slider, MenuItem, FormControl } from '@mui/material';
import unitedStatesLocations from './data/unitedStatesLocations.json';
import countries from './data/countries.json';
import React, { useState, useEffect, useMemo,} from 'react';

const UNITED_STATES = 'United States of America';
const ITEM_TYPES = [
    'Beverage',
    'Food',
    'Game',
    'Video',
];

const FIELD_DEFAULTS = {
    CITY:           '',
    COUNTRY:        UNITED_STATES,
    DESCRIPTION:    '',
    NAME:           '',
    RATING:         5,
    SOURCE:         '',
    STATE:          '',
    SUBTYPE:        '',
    TYPE:           'Beverage',
};

const ITEM_ENDPOINT = '/api/item';
const ADD_IMAGE_ENDPOINT = '/api/items/addImage';

const tagsFetcher = (url) => fetch(url).then((res) => res.json());
const stateOptions = Object.keys(unitedStatesLocations).sort();

// Sends the image data to the server, returns the reponse.
const uploadImageToServer = async () => {
    const body = new FormData();
    body.append("file", imageFile);
    const response = await fetch(ADD_IMAGE_ENDPOINT, {
        method: "POST",
        body
    });
    return response;
};

export default function AddItem() {
    const [type, setType] = useState(FIELD_DEFAULTS.TYPE);
    const [subType, setSubType] = useState('Beer');
    const [name, setName] = useState(FIELD_DEFAULTS.NAME);
    const [source, setSource] = useState(FIELD_DEFAULTS.SOURCE);
    const [description, setDescription] = useState(FIELD_DEFAULTS.DESCRIPTION);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewSrc, setImagePreviewSrc] = useState(null);
    const [tags, setTags] = useState(['Cool', 'Beans', 'Baby']);
    const [city, setCity] = useState(FIELD_DEFAULTS.CITY);
    const [state, setState] = useState(FIELD_DEFAULTS.STATE);
    const [country, setCountry] = useState(FIELD_DEFAULTS.COUNTRY);
    const [rating, setRating] = useState(FIELD_DEFAULTS.RATING);


    const cityOptions = useMemo(() => unitedStatesLocations[state]?.sort(), [state]);
    console.log('city options?', cityOptions);

    const handleUploadImage = (e, b) => {
        console.log("Files", e.target.files);
        const files = e?.target?.files;
        if (files && files.length) {
            console.log("files[0]?", files[0]);
            const image = files[0];
            setImageFile(image);
            setImagePreviewSrc(URL.createObjectURL(image));
        }
    }


    const resetForm = () => {
        setCity(FIELD_DEFAULTS.CITY);
        setCountry(FIELD_DEFAULTS.COUNTRY);
        setDescription(FIELD_DEFAULTS.DESCRIPTION);
        setName(FIELD_DEFAULTS.NAME);
        setRating(FIELD_DEFAULTS.RATING);
        setState(FIELD_DEFAULTS.STATE);
        setSource(FIELD_DEFAULTS.SOURCE);
        setSubType(FIELD_DEFAULTS.SUBTYPE);
        setTags([]);
        setType(FIELD_DEFAULTS.TYPE);

        setImageFile(null);
        setImagePreviewSrc(null);
    };

    const saveItem = async () => {
        const fileUploadResponse = await uploadImageToServer();
        if (fileUploadResponse?.status !== 200) {
            console.log("Failed response", fileUploadResponse);
        }
        const fileUploadJson = await fileUploadResponse.json();
        console.log("File Upload JSON", fileUploadJson);
        const imageFilename = fileUploadJson?.newFilename;
        const imageUrl = `/images/items/${imageFilename}`;
        const itemData = {
            city,
            country,
            description,
            imageUrl,
            name,
            rating,
            state,
            source,
            subType,
            tags,
            type,
        };
        const options = {
            body: JSON.stringify(itemData),
            method: 'POST',
        };
        const response = await fetch('/api/item', options);
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
                // objectPosition={data.objectPosition}
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
    const handleCountryChange = e => setCountry(e.target.value);
    const handleStateChange = e => setState(e.target.value);
    const handleCityChange = e => setCity(e.target.value);

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
                            <Box sx={{display: 'flex'}}>
                                <FormControl>
                                    <InputLabel id="country-label">Country</InputLabel>
                                    <Select
                                        // labelId="type-label"
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
                                    <FormControl sx={{ml: 2}}>
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
                                    <FormControl sx={{ml: 2}}>
                                        <Autocomplete
                                            color="tertiary"
                                            disablePortal
                                            options={cityOptions}
                                            value={city}
                                            sx={{ width: 300 }}
                                            renderInput={(params) =>
                                                <TextField
                                                    {...params}
                                                    label="City"
                                                    onChange={handleCityChange}
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
                                    valueLabelDisplay="auto"
                                    defaultValue={FIELD_DEFAULTS.RATING}
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
                                // height: '4em',
                                // width: '4em',
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

