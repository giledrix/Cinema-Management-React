import '../../Style/AddMovie.css';
import { withRouter } from 'react-router-dom';
import React from 'react';
import moviesBL from '../../BL/moviesBL';
import { makeStyles } from '@material-ui/styles';
import { MoviesContext } from './MoviesContext'
import { useContext, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@material-ui/core/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import { MdMovieFilter } from 'react-icons/md';
import { BiListUl } from 'react-icons/bi';
import { MdPhotoAlbum } from 'react-icons/md';
import { AiFillSave } from 'react-icons/ai';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles({
    root: {
        '& > *': {
            width: '25ch',
        },

    },
    btn: {
        background: 'linear-gradient(45deg, #1c1b1b 30%, #000000 90%)',
    },
    notchedOutline: {
        color: "red !important", // label foucus color 
        borderWidth: "1px",
        borderColor: "black !important" // border color when not focus

    },
    cssOutlinedInput: {
        color: "black !important", // text color when not focus
        "&$cssFocused $notchedOutline": {
            borderColor: `black !important` // border color when Focused
        }

    },
    cssFocused: {
        color: "black !important" // text and label color when focued
    },

    cssLabel: {
        color: "black !important" // label color when out of focus
    }
});

function EditMovie_Comp(props) {
    const [movieData, setMovieData] = useContext(MoviesContext); // use contex API
    const [nameError, setNameError] = useState({ isInvalid: false, errorHelper: '' });
    const [genresError, setGenres] = useState({ isInvalid: false, errorHelper: '' });
    const [urlError, setUrlError] = useState({ isInvalid: false, errorHelper: '' });
    const [showPoser, setShowPoster] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();

    // will run on first render and when imgUrl is change
    useEffect(() => {
        imageExists(movieData.Image) ? setShowPoster(true) : setShowPoster(false) 
    }, [movieData.Image]);



    const checkInputs = async (e) => {
        e.preventDefault(); // prevent sumbit bottun to refresh page

        // check if string is URL
        let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator


        if (movieData.Name.length == 0) {
            setNameError({ isInvalid: true, errorHelper: "Movie Name must be filled" });
            setGenres({ isInvalid: false, errorHelper: "" });
            setUrlError({ isInvalid: false, errorHelper: "" });
        }
        else if (movieData.Name.length < 2) {
            setNameError({ isInvalid: true, errorHelper: "Movie Name must be at least 2 characters" });
            setGenres({ isInvalid: false, errorHelper: "" });
            setUrlError({ isInvalid: false, errorHelper: "" });
        }
        else if (movieData.Genres.length == 0) {
            setGenres({ isInvalid: true, errorHelper: "Genres must be filled" });
            setNameError({ isInvalid: false, errorHelper: "" });
            setUrlError({ isInvalid: false, errorHelper: "" });
        }
        else if (movieData.Genres.length < 2) {
            setGenres({ isInvalid: true, errorHelper: "Genres must be at least 2 characters" });
            setNameError({ isInvalid: false, errorHelper: "" });
            setUrlError({ isInvalid: false, errorHelper: "" });
        }
        else if (movieData.Image.length == 0) {
            setUrlError({ isInvalid: true, errorHelper: "Image URL must be filled" });
            setNameError({ isInvalid: false, errorHelper: "" });
            setGenres({ isInvalid: false, errorHelper: "" });
        }
        else if (!pattern.test((movieData.Image))) {
            setUrlError({ isInvalid: true, errorHelper: "Image Input is not URL" });
            setNameError({ isInvalid: false, errorHelper: "" });
            setGenres({ isInvalid: false, errorHelper: "" });
        }
        else if (movieData.premired == 0) {
            alert("Date must be set");

        }
        else { // all inputs are OK


            let resp;
            try {
                resp = await moviesBL.updateMovie(movieData.id, movieData); // send user data to WS
            }
            catch (err) {
                console.log(err);
            }

            if (resp == "Movie is Updated") { // if movie is created
                showSnackbarAlret('Movie is Updated !!', 'success');
                props.history.push("/menu/movies/allMovies"); // redirect to all movies
            }
            else {
                showSnackbarAlret('Failed update movie', 'error');
            }
        }
    }


    const showSnackbarAlret = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant: variant });
    };

    function imageExists(image_url) {

        var http = new XMLHttpRequest();

        http.open('HEAD', image_url, false);
        try {
            http.send();
        } catch (err) {
            console.error(err);
        }

        return http.status != 404;
    }

    return (
        <div style={{
            backgroundColor: '#1a415c',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            height: '100vh'
        }}>

            <Box id="formBox"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
            >

                <form id="editMovieForm" noValidate autoComplete="off" onSubmit={e => checkInputs(e)}>


                    <h2> Edit Movie: {movieData.Name} </h2>

                    {
                        showPoser && <img id="poster" src={movieData.Image} onError={(e) => { e.target.onError = null; setShowPoster(false) }} />
                    }<br />


                    <TextField
                        id="outlined-basic"
                        label="Movie name"
                        variant="outlined"
                        type="text"
                        name="name"
                        value={movieData.Name}
                        error={nameError.isInvalid ? true : false}
                        helperText={nameError.errorHelper}
                        onChange={e => setMovieData({ ...movieData, Name: e.target.value })}
                        InputLabelProps={{
                            classes: {
                                root: classes.cssLabel,
                                focused: classes.cssFocused
                            }
                        }}
                        InputProps={{
                            classes: {
                                root: classes.cssOutlinedInput,
                                focused: classes.cssFocused,
                                notchedOutline: classes.notchedOutline
                            },
                            startAdornment: (
                                <InputAdornment position="start">
                                    <MdMovieFilter size={20} color="black" />
                                </InputAdornment>
                            ),

                        }} />
                    <br />

                    <TextField
                        id="outlined-basic"
                        label="Genres"
                        variant="outlined"
                        type="text"
                        name="name"
                        value={movieData.Genres}
                        error={genresError.isInvalid ? true : false}
                        helperText={genresError.errorHelper}
                        onChange={e => setMovieData({ ...movieData, Genres: e.target.value })}
                        InputLabelProps={{
                            classes: {
                                root: classes.cssLabel,
                                focused: classes.cssFocused
                            }
                        }}
                        InputProps={{
                            classes: {
                                root: classes.cssOutlinedInput,
                                focused: classes.cssFocused,
                                notchedOutline: classes.notchedOutline
                            },
                            startAdornment: (
                                <InputAdornment position="start">
                                    <BiListUl size={20} color="black" />
                                </InputAdornment>
                            ),

                        }} />
                    <br />

                    <TextField
                        id="outlined-basic"
                        label="Image url"
                        variant="outlined"
                        type="text"
                        name="name"
                        value={movieData.Image}
                        error={urlError.isInvalid ? true : false}
                        helperText={urlError.errorHelper}
                        onChange={e => setMovieData({ ...movieData, Image: e.target.value })}
                        InputLabelProps={{
                            classes: {
                                root: classes.cssLabel,
                                focused: classes.cssFocused
                            }
                        }}
                        InputProps={{
                            classes: {
                                root: classes.cssOutlinedInput,
                                focused: classes.cssFocused,
                                notchedOutline: classes.notchedOutline
                            },
                            startAdornment: (
                                <InputAdornment position="start">
                                    <MdPhotoAlbum size={20} color="black" />
                                </InputAdornment>
                            ),

                        }} />
                    <br />


                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                            label="Premired"
                            value={movieData.Premiered}
                            onChange={(newValue) => {
                                setMovieData({ ...movieData, Premiered: newValue })
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>


                    <br /><br />

                    <Button
                        className={classes.btn}
                        variant="contained"
                        color="primary"
                        size="small"
                        type="submit"
                        startIcon={<AiFillSave />}
                        style={{ maxWidth: '140px', minWidth: '140px', minHeight: '40px', color: '#FFC107', margin: '5px' }}
                    >
                        Update
                    </Button>


                    <Button
                        className={classes.btn}
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => props.history.push("/menu/movies/allMovies")}
                        startIcon={<ExitToAppIcon />}
                        style={{ maxWidth: '140px', minWidth: '140px', minHeight: '40px', color: '#FFC107', margin: '5px' }}
                    >
                        Cancel
                    </Button><br />



                </form>

            </Box>

        </div>
    )
}

export default withRouter(EditMovie_Comp);