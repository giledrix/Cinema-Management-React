import '../../Style/login.css';
import { useState, useEffect } from 'react';
import usersBL from '../../BL/usersBL';
import currentUser from '../../Utils/CurrentUser';
import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@mui/material/Box';
import InputAdornment from '@material-ui/core/InputAdornment';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { FaUserCircle } from 'react-icons/fa';
import { BsFillLockFill } from 'react-icons/bs';
import Background from '../../Style/images/login_background.jpg';
import { useSnackbar } from 'notistack';
import { circularProgressClasses } from '@material-ui/core';


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



function Login_Comp(props) {

    const [user, setUser] = useState({ username: '', password: '' });
    const [usernameError, setUsernameError] = useState({ isInvalid: false, errorHelper: '' });
    const [passError, setPassError] = useState({ isInvalid: false, errorHelper: '' });
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();


    // Auto login if user is have verified token
    useEffect(async () => {

        // Check if session storage exist
        if (sessionStorage.getItem('currentUser')) {
            let status = await usersBL.verifyUserToken();

            if (status && status.data.message === "User is verified") {
                props.history.push("/menu/movies/allMovies");
            }
        }
    }, [])


    useEffect(() => {
        // Disable error color and text
        setUsernameError({ isInvalid: false, errorHelper: '' });
        setPassError({ isInvalid: false, errorHelper: '' });
    }, [user.username, user.password]) // Depend only in text

    const showSnackbarAlert = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant: variant });
    };



    const checkInputs = async (e) => {
        e.preventDefault(); // Prevent submit button to refresh page

        if (user.username.length < 1) {
            setUsernameError({ isInvalid: true, errorHelper: "Insert Username" });
        }
        else if (user.password < 1) {
            setPassError({ isInvalid: true, errorHelper: "Insert Password" });
        }
        else {
            let resp = await usersBL.loginValidation(user);
            let userData = resp.data;

            if (typeof userData === 'object' && userData !== null) { // If user is found

                currentUser.saveCurrentUserData(userData); // Save all user data (include token) in session storage
                props.history.push("/menu/home"); // Redirect to menu 
                showSnackbarAlert('Login Successfully !! ', 'success');
            }
            else if (userData === "Password incorrect") { // If password is incorrect show proper message 
                setPassError({ isInvalid: true, errorHelper: "Incorrect Password" });
            }
            else {                // If user is not exist show proper message
                setUsernameError({ isInvalid: true, errorHelper: "User is not exist" });
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
                }}>



                <h1> Login  </h1>

                {/* When press submit, call sendData function and send him the event as parameter */}
                <form noValidate autoComplete="off" onSubmit={e => checkInputs(e)}>


                    <TextField
                        id="outlined-basic"
                        label="Username"
                        variant="outlined"
                        type="text"
                        name="username"
                        value= "admin"
                        error={usernameError.isInvalid ? true : false}
                        helperText={usernameError.errorHelper}
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
                        }} />
                    <br />

                    <TextField id="outlined-error-helper-text" label="Password" variant="outlined" type="password" name="password" value= "admin" error={passError.isInvalid ? true : false} helperText={passError.errorHelper}
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
                        }} />
                    <br />


                    <Button
                        className={classes.root}
                        variant="contained"
                        color="primary"
                        size="large"
                        type="submit"
                        startIcon={<ExitToAppIcon />}
                        style={{ minWidth: '220px', minHeight: '50px', color: '#FFC107' }}
                    >
                        Login
                    </Button><br />

                </form>


                <br />
                <span id="new_user_lable">New User?</span> <span id="createUserLink" onClick={() => props.history.push("/register")}>Create Account </span> <br />
            </Box>


        </div>

    );
}

export default Login_Comp;
