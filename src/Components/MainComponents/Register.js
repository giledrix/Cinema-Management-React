import '../../Style/login.css';
import { useState, useEffect } from 'react';
import usersBL from '../../BL/usersBL';
import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@mui/material/Box';
import InputAdornment from '@material-ui/core/InputAdornment';
import CreateIcon from '@material-ui/icons/Create';
import Background from '../../Style/images/login_background.jpg';
import { FaUserCircle } from 'react-icons/fa';
import { BsFillLockFill } from 'react-icons/bs';
import { useSnackbar } from 'notistack';
import React from 'react';


const useStyles = makeStyles({
    root: {
        background: 'linear-gradient(45deg, #1c1b1b 30%, #000000 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 48,
        padding: '0 30px',

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

function Register_Comp(props) {

    const [user, setUser] = useState({ username: '', password: '' });
    const [usernameError, setUsernameError] = useState({ isInvalid: false, errorHelper: '' });
    const [passError, setPassError] = useState({ isInvalid: false, errorHelper: '' });
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();

    useEffect(() => {
        // Disable error color and text
        setUsernameError({ isInvalid: false, errorHelper: '' });
        setPassError({ isInvalid: false, errorHelper: '' });
    }, [user.username, user.password]) // depend only in text


    const showSnackbarAlret =  (message,variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant: variant });
    };

    const checkInputs = async (e) => {
        e.preventDefault(); // prevent sumbit bottun to refresh page
        if (user.username.length < 1) {
            setUsernameError({ isInvalid: true, errorHelper: "Please insert useranme" });
        }
        else if (user.password.length < 4) {
            setPassError({ isInvalid: true, errorHelper: "password must be atleast 4 characters" });
        }
        else {
            let resp = await usersBL.createNewUser(user);
            let status = resp.data;

            if (status == "Password Already set") { // if user is already created
                setUsernameError({ isInvalid: true, errorHelper: "User is already Created (password already set)...." });
            }
            else if (status == "User is not exist") { // if user is not registred
                setUsernameError({ isInvalid: true, errorHelper: "User is not exist" });
            }
            else {      // if password is create successfully
                showSnackbarAlret('Password set successfully , please login..','success');
                props.history.push("/"); // redirect to login 
            }
        }

    }

    return (
        <div style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,1)),url(${Background})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            width: '100vw',
            height: '100vh',
            display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'
        }}>

            <Box id="formBox"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}

            >

                <h2>Create an Account  </h2>

                {/* when press submit call sendData funcrtion and send him the event as parameter */}
                <form noValidate autoComplete="off" onSubmit={e => checkInputs(e)}>

                    <TextField id="outlined-basic" label="Username" variant="outlined" type="text" name="username" error={usernameError.isInvalid ? true : false} helperText={usernameError.errorHelper}
                        onChange={e => setUser({ ...user, username: e.target.value })}
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
                        }} />  <br />

                    <TextField id="outlined-error-helper-text" label="Password" variant="outlined" type="password" name="password" error={passError.isInvalid ? true : false} helperText={passError.errorHelper}
                        onChange={e => setUser({ ...user, password: e.target.value })}
                        InputProps={{
                            classes: {
                                root: classes.cssOutlinedInput,
                                focused: classes.cssFocused,
                                notchedOutline: classes.notchedOutline
                            },
                            startAdornment: (
                                <InputAdornment position="start">
                                    <BsFillLockFill size={21} color="black" />
                                </InputAdornment>
                            ),
                        }}
                        InputLabelProps={{
                            classes: {
                                root: classes.cssLabel,
                                focused: classes.cssFocused
                            }
                        }} />  <br />


                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        type="submit"
                        className={classes.root}
                        startIcon={<CreateIcon />}
                        style={{ minWidth: '220px', minHeight: '50px', color: '#FFC107' }}
                    >
                        Create
                    </Button>





                </form>
                <br />
                <span id="new_user_lable">Already have account ?</span> <span id="createUserLink" onClick={() => props.history.push("/")}>Sign-in </span> <br />
            </Box>
            <br />



        </div>
    );
}

export default Register_Comp;