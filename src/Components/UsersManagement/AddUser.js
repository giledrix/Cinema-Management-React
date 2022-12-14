import '../../Style/AddUser.css';
import { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import React from 'react';
import { makeStyles } from '@material-ui/styles';
import usersBL from '../../BL/usersBL';
import { useSnackbar } from 'notistack';
import Box from '@mui/material/Box';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import { AiFillRobot } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { IoIosCreate } from "react-icons/io";
import { RiTimeFill } from "react-icons/ri";
import { GrUserAdmin } from "react-icons/gr";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SvgIcon from "@mui/material/SvgIcon";

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

  },
});




function AddUser_Comp(props) {
  const [user, setUser] = useState({ username: '', fname: '', lname: '', sessionTimeout: 0, classification: "user", permissions: [] });
  const [firstNameError, setFirstNameError] = useState({ isInvalid: false, errorHelper: '' });
  const [lastNameError, setLastNameError] = useState({ isInvalid: false, errorHelper: '' });
  const [useranmeError, setUsernameError] = useState({ isInvalid: false, errorHelper: '' });
  const [sessionTimeOutError, setSessionTimeOutError] = useState({ isInvalid: false, errorHelper: '' });
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  // will run on first render and get all users data from all sources and then store the data in state 
  // Check User Token (this useEffect is only for check if token is expired)
  useEffect(async () => {

    let resp = await usersBL.verifyUserToken();
    if (resp && resp.data.message == "jwt TokenExpiredError") {
      sessionStorage.clear();
      showSnackbarAlret('Session is timeout !!', 'error');
      props.history.push('/');
    }


  }, []);

  const premissionsHandler = (e) => {
    let updatedPermissionsArry = user.permissions;

    if (e.target.checked) { // if Permission is checked
      updatedPermissionsArry.push(e.target.value); // add the permission to array

      // if the the persmissio is one of those
      if (e.target.value == "Create Subscriptions" || e.target.value == "Update Subscriptions" || e.target.value == "Delete Subscriptions") {
        let index = updatedPermissionsArry.indexOf("View Subscriptions"); // search if View Subscriptions already in permission array ( prevent double !!)
        if (index < 0) { // if view perm not exist in array
          updatedPermissionsArry.push("View Subscriptions"); // Add -View- permisision automaticly because Create/Update/Delete permissionis is checked 
        }
      }
      else if (e.target.value == "Create Movies" || e.target.value == "Delete Movies" || e.target.value == "Update Movies") {
        let index = updatedPermissionsArry.indexOf("View Movies"); // search if View Movies perm already in permission array ( prevent double !!)
        if (index < 0) { // view movies perm not exist in array
          updatedPermissionsArry.push("View Movies"); // Add view permisision automaticly because Create/Update/Delete permissionis is checked 
        }
      }
    }
    else { // if unchecked

      if (e.target.value == "View Movies") { // if "View Movies" then delete Create,Delete,Update also
        let permissionsForDeleteArr = ["View Movies", "Create Movies", "Delete Movies", "Update Movies"];
        permissionsForDeleteArr.forEach(p => {
          let index = updatedPermissionsArry.indexOf(p); // search the permission in the permisiion array
          if (index > -1) { // if is founded
            updatedPermissionsArry.splice(index, 1); // remove him
          }
        });
      }
      else if (e.target.value == "View Subscriptions") {// if "View Movies" then delete Create,Delete,Update subscription also
        let permissionsForDeleteArr = ["View Subscriptions", "Create Subscriptions", "Update Subscriptions", "Delete Subscriptions"];
        permissionsForDeleteArr.forEach(p => {
          let index = updatedPermissionsArry.indexOf(p); // search the permission in the permisiion array
          if (index > -1) { // if is founded
            updatedPermissionsArry.splice(index, 1); // remove him
          }
        });
      }
      else {
        let index = updatedPermissionsArry.indexOf(e.target.value); // search the permission in the permisiion array
        if (index > -1) { // if is founded
          updatedPermissionsArry.splice(index, 1); // remove him
        }
      }
    }

    setUser({ ...user, permissions: updatedPermissionsArry }); // save the updated permissions in state
  }

  const checkInputs = async (e) => {
    e.preventDefault(); // prevent sumbit bottun to refresh page


    if (user.fname.length < 2) {
      setFirstNameError({ isInvalid: true, errorHelper: "First name must be atleast 2 characters" });
      setLastNameError({ isInvalid: false, errorHelper: "" });
      setUsernameError({ isInvalid: false, errorHelper: "" });
      setSessionTimeOutError({ isInvalid: false, errorHelper: "" });
    }
    else if (user.lname.length < 2) {
      setLastNameError({ isInvalid: true, errorHelper: "Last name must be atleast 2 characters" });
      setFirstNameError({ isInvalid: false, errorHelper: "" });
      setUsernameError({ isInvalid: false, errorHelper: "" });
      setSessionTimeOutError({ isInvalid: false, errorHelper: "" });
    }
    else if (user.username.length < 3) {
      setUsernameError({ isInvalid: true, errorHelper: "Enter a valid username" });
      setLastNameError({ isInvalid: false, errorHelper: "" });
      setFirstNameError({ isInvalid: false, errorHelper: "" });
      setSessionTimeOutError({ isInvalid: false, errorHelper: "" });
    }
    else if (user.sessionTimeout == 0 || user.sessionTimeout.value < 0) {
      setSessionTimeOutError({ isInvalid: false, errorHelper: "Enter value biggter then 0" });
      setUsernameError({ isInvalid: false, errorHelper: "" });
      setLastNameError({ isInvalid: false, errorHelper: "" });
      setFirstNameError({ isInvalid: false, errorHelper: "" });
    }
    else { // all inputs are OK
      let resp = await usersBL.adminCreateNewUser(user); // send user data to WS
      let status = resp.data.status;

      if (status == "Username already exists") { // if username is taken
        alert("Username is already taken , please choose another");
        // setUsernameError({ isInvalid: true, errorHelper: "User is already Created (password already set)...." });
      }
      else if (status == "OK") { // if user is successfully created
        showSnackbarAlret('User is Successfully Created !!', 'success');
        props.history.push("/menu/usersmanagement/allusers"); // redirect to login
      }
      else {      // if creating is failed 
        showSnackbarAlret('User Create is failed , please try again...', 'error');
      }
    }
  }

  const showSnackbarAlret = (message, variant) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(message, { variant: variant });
  };

  return (
    <div style={{
      backgroundColor: '#1a415c',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      height: '130vh'
    }}>

      <Box id="formBox"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' }, // gapping between elements (TextField)
        }}

      >

        <form id="addMovieForm" className={classes.root} noValidate autoComplete="off" onSubmit={e => checkInputs(e)}>


          <h2> Add New User: </h2>

          <TextField
            id="outlined-basic"
            label="First Name"
            variant="outlined"
            type="text"
            name="name"
            error={firstNameError.isInvalid ? true : false}
            helperText={firstNameError.errorHelper}
            onChange={e => setUser({ ...user, fname: e.target.value })}
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
                  <AiFillRobot size={20} color="black" />
                </InputAdornment>
              ),

            }} />
          <br />

          <TextField
            id="outlined-basic"
            label="Last Name"
            variant="outlined"
            type="text"
            name="lname"
            error={lastNameError.isInvalid ? true : false}
            helperText={lastNameError.errorHelper}
            onChange={e => setUser({ ...user, lname: e.target.value })}
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
                  <AiFillRobot size={20} color="black" />
                </InputAdornment>
              ),

            }} />
          <br />

          <TextField
            id="outlined-basic"
            label="Username"
            variant="outlined"
            type="text"
            name="username"
            error={useranmeError.isInvalid ? true : false}
            helperText={useranmeError.errorHelper}
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

          <TextField
            id="outlined-basic"
            label="Session Timeout"
            variant="outlined"
            type="number"
            name="timeout"
            error={sessionTimeOutError.isInvalid ? true : false}
            helperText={sessionTimeOutError.errorHelper}
            onChange={e => setUser({ ...user, sessionTimeout: e.target.value })}
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
              inputProps: {
                max: 1440, min: 1
              },
              startAdornment: (
                <InputAdornment position="start">
                  <RiTimeFill size={22} color="black" />
                </InputAdornment>
              ),

            }} />
          <br />

          <FormControl sx={{ m: 1, minWidth: 150 }}>
            <InputLabel id="select-helper-label" > Classification </InputLabel>
            <Select
              labelId="select-helper-label"
              id="select-helper"
              value={user.classification}
              label="Classification"
              onChange={e => setUser({ ...user, classification: e.target.value })}

              renderValue={(value) => {

                return (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <SvgIcon color="primary">
                      <GrUserAdmin />
                    </SvgIcon>
                    {value}
                  </Box>
                );
              }}

            >
              <MenuItem value="user">user</MenuItem>
              <MenuItem value="administrator">administrator</MenuItem>
            </Select>
          </FormControl>



          <br />

          <h3> Permissons: </h3>

          <FormControlLabel control={<Checkbox />} label="View Subscriptions" id="view_subscriptions" name="ViewSubscriptions" value="View Subscriptions" checked={user.permissions.includes("View Subscriptions") ? true : false} onChange={(e) => premissionsHandler(e)} />

          <FormControlLabel control={<Checkbox />} label="Create Subscriptions" id="create_sub" name="CreateSubscriptions" value="Create Subscriptions" checked={user.permissions.includes("Create Subscriptions") ? true : false} onChange={e => premissionsHandler(e)} /><br />

          <FormControlLabel control={<Checkbox />} label="Delete Subscriptions" id="delete_sub" name="DeleteSubscriptions" value="Delete Subscriptions" checked={user.permissions.includes("Delete Subscriptions") ? true : false} onChange={e => premissionsHandler(e)} />

          <FormControlLabel control={<Checkbox />} label="Update Subscriptions" id="update_sub" name="UpdateSubscriptions" value="Update Subscriptions" checked={user.permissions.includes("Update Subscriptions") ? true : false} onChange={e => premissionsHandler(e)} /><br />

          <FormControlLabel control={<Checkbox />} label="View Movies" id="view_movie" name="ViewMovies" value="View Movies" checked={user.permissions.includes("View Movies") ? true : false} onChange={(e) => premissionsHandler(e)} />

          <FormControlLabel control={<Checkbox />} label="Create Movies" id="create_movie" name="CreateMovies" value="Create Movies" checked={user.permissions.includes("Create Movies") ? true : false} onChange={e => premissionsHandler(e)} /><br />

          <FormControlLabel control={<Checkbox />} label="Delete Movies" id="delete_movie" name="DeleteMovies" value="Delete Movies" checked={user.permissions.includes("Delete Movies") ? true : false} onChange={e => premissionsHandler(e)} />

          <FormControlLabel control={<Checkbox />} label="Update Movies" id="update_movie" name="UpdateMovies" value="Update Movies" checked={user.permissions.includes("Update Movies") ? true : false} onChange={e => premissionsHandler(e)} /><br />

          <br /><br />

          <Button
            className={classes.btn}
            variant="contained"
            color="primary"
            size="small"
            type="submit"
            startIcon={<IoIosCreate />}
            style={{ maxWidth: '140px', minHeight: '40px', color: '#FFC107', margin: '5px' }}
          >
            Create
          </Button>


          <Button
            className={classes.btn}
            variant="contained"
            color="primary"
            size="small"
            onClick={() => props.history.push("/menu/usersmanagement/allusers")}
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

export default withRouter(AddUser_Comp);