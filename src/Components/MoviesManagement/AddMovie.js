import '../../Style/AddMovie.css';
import { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import React from 'react';
import { makeStyles } from '@material-ui/styles';
import moviesBL from '../../BL/moviesBL';
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


function AddMovie_Comp(props) {
    const [movie, setMovie] = useState({ name: '', genres: '', imgUrl: '', premired: new Date() });
    const [nameError, setNameError] = useState({ isInvalid: false, errorHelper: '' });
    const [genresError, setGenres] = useState({ isInvalid: false, errorHelper: '' });
    const [urlError, setUrlError] = useState({ isInvalid: false, errorHelper: '' });
    const [showPoser, setShowPoster] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();

    // will run on first render and when imgUrl is change
    useEffect(() => {
        imageExists(movie.imgUrl) ? setShowPoster(true) : setShowPoster(false) 
    }, [movie.imgUrl]);

    const showSnackbarAlret = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant: variant });
    };


    const checkInputs = async (e) => {
        e.preventDefault(); // prevent sumbit bottun to refresh page

        // check if string is URL
        let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator


        if (movie.name.length == 0) {
            setNameError({ isInvalid: true, errorHelper: "Movie Name must be filled" });
            setGenres({ isInvalid: false, errorHelper: "" });
            setUrlError({ isInvalid: false, errorHelper: "" });
        }
        else if (movie.name.length < 2) {
            setNameError({ isInvalid: true, errorHelper: "Movie Name must be at least 2 characters" });
            setGenres({ isInvalid: false, errorHelper: "" });
            setUrlError({ isInvalid: false, errorHelper: "" });
        }
        else if (movie.genres.length == 0) {
            setGenres({ isInvalid: true, errorHelper: "Genres must be filled" });
            setNameError({ isInvalid: false, errorHelper: "" });
            setUrlError({ isInvalid: false, errorHelper: "" });
        }
        else if (movie.genres.length < 2) {
            setGenres({ isInvalid: true, errorHelper: "Genres must be at least 2 characters" });
            setNameError({ isInvalid: false, errorHelper: "" });
            setUrlError({ isInvalid: false, errorHelper: "" });
        }
        else if (movie.imgUrl.length == 0) {
            setGenres({ isInvalid: true, errorHelper: "" });
            setUrlError({ isInvalid: true, errorHelper: "Image URL must be filled" });
            setNameError({ isInvalid: false, errorHelper: "" });
        }
        else if (!pattern.test((movie.imgUrl))) {
            setUrlError({ isInvalid: true, errorHelper: "Image Input is not URL" });
            setNameError({ isInvalid: false, errorHelper: "" });
            setGenres({ isInvalid: false, errorHelper: "" });
        }
        else if (movie.premired == 0) {
            alert("Date must be set");

        }
        else { // all inputs are OK

            let resp;
            try {
                resp = await moviesBL.addMovie(movie); // send user data to WS
            }
            catch (err) {
                console.log(err);
            }

            if (resp == "Movie is Created") { // if movie is created
                showSnackbarAlret('Movie is Created !!', 'success');
                props.history.push("/menu/movies/allMovies"); // redirect to all movies
            }
            else {
                showSnackbarAlret('Failed to create a movie..', 'error');
            }

        }
    }

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
                    '& .MuiTextField-root': { m: 1, width: '25ch' }, // gapping between elements (TextField)
                }}

            >

                <form className={classes.root} noValidate autoComplete="off" onSubmit={e => checkInputs(e)}>

                    <h2> Add New Movie: </h2>

                    {
                        showPoser && <img id="poster" src={movie.imgUrl} onError={(e) => { e.target.onError = null; setShowPoster(false) }} />
                    }<br />


                    <TextField
                        id="outlined-basic"
                        label="Movie name"
                        variant="outlined"
                        type="text"
                        name="name"
                        error={nameError.isInvalid ? true : false}
                        helperText={nameError.errorHelper}
                        onChange={e => setMovie({ ...movie, name: e.target.value })}
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
                        error={genresError.isInvalid ? true : false}
                        helperText={genresError.errorHelper}
                        onChange={e => setMovie({ ...movie, genres: e.target.value })}
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
                        error={urlError.isInvalid ? true : false}
                        helperText={urlError.errorHelper}
                        onChange={e => setMovie({ ...movie, imgUrl: e.target.value })}
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
                            value={movie.premired}
                            minDate={new Date('2021-01-01')}
                            onChange={(newValue) => {
                                setMovie({ ...movie, premired: newValue })
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
                        style={{ maxWidth: '140px', minHeight: '40px', color: '#FFC107', margin: '5px' }}
                    >
                        Save
                    </Button>


                    <Button
                        className={classes.btn}
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => props.history.push("/menu/movies/allMovies")}
                        startIcon={<ExitToAppIcon />}
                        style={{ maxWidth: '140px', minHeight: '40px', color: '#FFC107', margin: '5px' }}
                    >
                        Cancel
                    </Button><br />

                </form>

            </Box>


        </div>
    )
}

export default withRouter(AddMovie_Comp);