import '../../Style/AddUser.css';
import { useState,useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import React from 'react';
import SubscriptionsBL from '../../BL/SubscriptionsBL';
import usersBL from '../../BL/usersBL';
import Box from '@mui/material/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import { FaUserCircle } from 'react-icons/fa';
import { MdEmail, MdLocationCity } from 'react-icons/md';
import { IoIosCreate } from 'react-icons/io';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
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
        color: "red !important", // Label focus color 
        borderWidth: "1px",
        borderColor: "black !important" // Border color when not focus

    },
    cssOutlinedInput: {
        color: "black !important", // Text color when not focus
        "&$cssFocused $notchedOutline": {
            borderColor: `black !important` // Border color when Focused
        }

    },
    cssFocused: {
        color: "black !important" // Text and label color when focused
    },

    cssLabel: {
        color: "black !important" // Label color when out of focus
    }
});


function AddMember_Comp(props) {
    const [member, setMember] = useState({ Name: '', Email: '', City: '' });
    const [nameError, setNameError] = useState({ isInvalid: false, errorHelper: '' });
    const [EmailError, setEmailError] = useState({ isInvalid: false, errorHelper: '' });
    const [CityError, setCityError] = useState({ isInvalid: false, errorHelper: '' });
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();

    // Will run on first render and get all users data from all sources and then store the data in state 
    useEffect(async () => {
        let resp = await usersBL.verifyUserToken();

        // Check if user token expired
        if (resp && resp.data.message === "jwt TokenExpiredError") {
            sessionStorage.clear();
            showSnackbarAlert('Session is timeout !!', 'error');
            props.history.push('/');
        }
    }, []);

    const checkInputs = async (e) => {
        e.preventDefault(); // Prevent sumbit button to refresh the page


        if (member.Name.length === 0) {
            setNameError({ isInvalid: true, errorHelper: "Member Name must be filled" });
            setEmailError({ isInvalid: false, errorHelper: "" });
            setCityError({ isInvalid: false, errorHelper: "" });
        }
        else if (member.Name.length < 2) {
            setNameError({ isInvalid: true, errorHelper: "Member Name must be at least 2 char" });
            setEmailError({ isInvalid: false, errorHelper: "" });
            setCityError({ isInvalid: false, errorHelper: "" });

        }
        else if (member.Email.length === 0) {
            setNameError({ isInvalid: false, errorHelper: "" });
            setEmailError({ isInvalid: true, errorHelper: "Email must be filled" });
            setCityError({ isInvalid: false, errorHelper: "" });

        }
        else if (member.Email.length < 2) {
            setNameError({ isInvalid: false, errorHelper: "" });
            setEmailError({ isInvalid: true, errorHelper: "Email must be at least 2 char" });
            setCityError({ isInvalid: false, errorHelper: "" });

        }
        else if (member.City.length === 0) {
            setNameError({ isInvalid: false, errorHelper: "" });
            setEmailError({ isInvalid: false, errorHelper: "" });
            setCityError({ isInvalid: true, errorHelper: "City must be filled" });
        }
        else if (member.City.length < 0) {
            setNameError({ isInvalid: false, errorHelper: "" });
            setEmailError({ isInvalid: false, errorHelper: "" });
            setCityError({ isInvalid: true, errorHelper: "City must beat least 2 char" });
        }
        else { // All inputs are OK

            let resp;
            try {
                resp = await SubscriptionsBL.addMember(member) // Send member data to WS
            }
            catch (err) {
                console.log(err);
            }

            if (resp.data === "Member is Created") { // if movie is created
                showSnackbarAlert('Member is Created !!', 'success');
                props.history.push("/menu/SubscriptionManagement/allMembers"); // Redirect to all movies
            }
            else if (resp === "Member is already exists") {
                showSnackbarAlert('Member is already exists..', 'error');
            }
            else {
                showSnackbarAlert('Failed create Member..', 'error');
            }
        }
    }

    const showSnackbarAlert = (message, variant) => {
        // Variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant: variant });
    };

    return (
        <div>

            <Box id="formBox"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}

            >

                <form noValidate autoComplete="off" onSubmit={e => checkInputs(e)}>

                    <h2> Add Member: </h2>

                    <TextField
                        id="outlined-basic"
                        label="Member Name"
                        variant="outlined"
                        type="text"
                        name="name"
                        error={nameError.isInvalid ? true : false}
                        helperText={nameError.errorHelper}
                        onChange={e => setMember({ ...member, Name: e.target.value })}
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
                                    <FaUserCircle size={20} color="black" />
                                </InputAdornment>
                            ),

                        }} />
                    <br />

                    <TextField
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                        type="text"
                        name="name"
                        error={EmailError.isInvalid ? true : false}
                        helperText={EmailError.errorHelper}
                        onChange={e => setMember({ ...member, Email: e.target.value })}
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
                                    <MdEmail size={22} color="black" />
                                </InputAdornment>
                            ),

                        }} />
                    <br />

                    <TextField
                        id="outlined-basic"
                        label="City"
                        variant="outlined"
                        type="text"
                        name="name"
                        error={CityError.isInvalid ? true : false}
                        helperText={CityError.errorHelper}
                        onChange={e => setMember({ ...member, City: e.target.value })}
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
                                    <MdLocationCity size={22} color="black" />
                                </InputAdornment>
                            ),

                        }} />
                    <br /><br />




                    <Button
                        className={classes.btn}
                        variant="contained"
                        color="primary"
                        size="small"
                        type="submit"
                        startIcon={<IoIosCreate />}
                        style={{ maxWidth: '140px', minWidth: '140px', minHeight: '40px', color: '#FFC107', margin: '5px' }}
                    >
                        Create
                    </Button>


                    <Button
                        className={classes.btn}
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => props.history.push("/menu/SubscriptionManagement/allMembers")}
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

export default withRouter(AddMember_Comp);