import '../../Style/AddUser.css';
import { withRouter } from 'react-router-dom';
import React from 'react';
import { SubscriptionsContext } from './SubscriptionsContext'
import { useContext, useState } from 'react';
import SubscriptionsBL from '../../BL/SubscriptionsBL';
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
        color: "red !important", // label focus color 
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
        color: "black !important" // text and label color when focused
    },

    cssLabel: {
        color: "black !important" // label color when out of focus
    }
});




function EditMember_Comp(props) {
    const [memberData, setMemberData] = useContext(SubscriptionsContext); // Use context API
    const [nameError, setNameError] = useState({ isInvalid: false, errorHelper: '' });
    const [EmailError, setEmailError] = useState({ isInvalid: false, errorHelper: '' });
    const [CityError, setCityError] = useState({ isInvalid: false, errorHelper: '' });
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();


    const checkInputs = async (e) => {
        e.preventDefault(); // Prevent submit button to refresh page

        if (memberData.Name.length === 0) {
            setNameError({ isInvalid: true, errorHelper: "Member Name must be filled" });
            setEmailError({ isInvalid: false, errorHelper: "" });
            setCityError({ isInvalid: false, errorHelper: "" });
        }
        else if (memberData.Name.length < 2) {
            setNameError({ isInvalid: true, errorHelper: "Member Name must be at least 2 char" });
            setEmailError({ isInvalid: false, errorHelper: "" });
            setCityError({ isInvalid: false, errorHelper: "" });

        }
        else if (memberData.Email.length === 0) {
            setNameError({ isInvalid: false, errorHelper: "" });
            setEmailError({ isInvalid: true, errorHelper: "Email must be filled" });
            setCityError({ isInvalid: false, errorHelper: "" });

        }
        else if (memberData.Email.length < 2) {
            setNameError({ isInvalid: false, errorHelper: "" });
            setEmailError({ isInvalid: true, errorHelper: "Email must be at least 2 char" });
            setCityError({ isInvalid: false, errorHelper: "" });

        }
        else if (memberData.City.length === 0) {
            setNameError({ isInvalid: false, errorHelper: "" });
            setEmailError({ isInvalid: false, errorHelper: "" });
            setCityError({ isInvalid: true, errorHelper: "City must be filled" });
        }
        else if (memberData.City.length < 0) {
            setNameError({ isInvalid: false, errorHelper: "" });
            setEmailError({ isInvalid: false, errorHelper: "" });
            setCityError({ isInvalid: true, errorHelper: "City must beat least 2 char" });
        }
        else { // All inputs are OK

            let resp;
            try {
                resp = await SubscriptionsBL.updateMember(memberData); // Send member data to WS
            }
            catch (err) {
                console.log(err);
            }

            if (resp.data === "Member is Updated") { // If movie is created
                showSnackbarAlret('Member is Updated !!', 'success');
                props.history.push("/menu/SubscriptionManagement/allMembers"); // Redirect to all movies
            }
            else {
                showSnackbarAlret('Failed update member..', 'error');
            }
        }
    }

    const showSnackbarAlret = (message, variant) => {
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

                    <h2>Edit : {memberData.Name} </h2>

                    <TextField
                        id="outlined-basic"
                        label="Member Name"
                        variant="outlined"
                        type="text"
                        name="name"
                        value={memberData.Name}
                        error={nameError.isInvalid ? true : false}
                        helperText={nameError.errorHelper}
                        onChange={e => setMemberData({ ...memberData, Name: e.target.value })}
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
                        value={memberData.Email}
                        error={EmailError.isInvalid ? true : false}
                        helperText={EmailError.errorHelper}
                        onChange={e => setMemberData({ ...memberData, Email: e.target.value })}
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
                        value={memberData.City}
                        error={CityError.isInvalid ? true : false}
                        helperText={CityError.errorHelper}
                        onChange={e => setMemberData({ ...memberData, City: e.target.value })}
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
                        Update
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

export default withRouter(EditMember_Comp);