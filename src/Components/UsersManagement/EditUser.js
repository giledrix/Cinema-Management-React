import '../../Style/AddMovie.css';
import { withRouter } from 'react-router-dom';
import { UsersContext } from './Context'
import { useContext } from 'react';
import { useState } from 'react';
import React from 'react';
import { makeStyles } from '@material-ui/styles';
import usersBL from '../../BL/usersBL';
import { useSnackbar } from 'notistack';
import Box from '@mui/material/Box';
import { AiFillSave } from 'react-icons/ai';
import { AiFillRobot } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { RiTimeFill } from "react-icons/ri";
import { GrUserAdmin } from "react-icons/gr";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SvgIcon from "@mui/material/SvgIcon";
import CurrentUser from '../../Utils/CurrentUser';

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


function EditUser_Comp(props) {
  const [userData, setUserData] = useContext(UsersContext); // use contex API
  const [firstNameError, setFirstNameError] = useState({ isInvalid: false, errorHelper: '' });
  const [lastNameError, setLastNameError] = useState({ isInvalid: false, errorHelper: '' });
  const [useranmeError, setUsernameError] = useState({ isInvalid: false, errorHelper: '' });
  const [sessionTimeOutError, setSessionTimeOutError] = useState({ isInvalid: false, errorHelper: '' });
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();


  const premissionsHandler = (e) => {
    let updatedPermissionsArry = userData.permissions;

    if (e.target.checked) { // if Permission is checked
      updatedPermissionsArry.push(e.target.value); // add the permission to array

      // if the the persmissio is one of those
      if (e.target.value == "Create Subscriptions" || e.target.value == "Update Subscriptions" || e.target.value == "Delete Subscriptions") {
        let index = updatedPermissionsArry.indexOf("View Subscriptions"); // search if View Subscriptions already in permission array ( prevent double !!)
        if (index < 0) { // view perm not exist in array
          updatedPermissionsArry.push("View Subscriptions"); // Add view permisision automaticly because Create/Update/Delete permissionis is checked 
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
    setUserData({ ...userData, permissions: updatedPermissionsArry }); // save the updated permissions in state
  }

  const checkInputs = async (e) => {
    e.preventDefault(); // prevent sumbit bottun to refresh page


    if (userData.firstName.length < 2) {
      alert("First name must be atleast 2 characters")
      // setPassError({ isInvalid: true, errorHelper: "First name must be atleast 2 characters" });
    }
    else if (userData.lastName.length < 2) {
      alert("Last name must be atleast 2 characters")
      // setPassError({ isInvalid: true, errorHelper: "Last name must be atleast 2 characters" });
    }
    else if (userData.username.length < 1) {
      alert("Please insert useranme")
      // setUsernameError({ isInvalid: true, errorHelper: "Please insert useranme" });
    }
    else if (userData.sessionTimeout == 0) {
      alert("Please set session timeout value");

    }
    else { // all inputs are OK
      let resp = await usersBL.updateUserData(userData); // send user data to WS
      let status = resp.data.status;

      console.log(userData);

      if (status == "OK") { // if user is successfully created

        if (userData.id == CurrentUser.getUserID) { // If edited user is me then update the session storage data

          let obj = {
            tokenCinemaWS: CurrentUser.getCinemaWSToken(),
            tokenSubscriptionWS: CurrentUser.getSubscribtionsWSToken(),
            user: {
              id: CurrentUser.getUserID(),
              classification: userData.classification,
              name: userData.firstName + " " + userData.lastName,
              username: userData.username,
              password: CurrentUser.getPassword(),
              tokenCinemaWS: CurrentUser.getCinemaWSToken(),
              tokenSubscriptionWS: CurrentUser.getSubscribtionsWSToken(),
              timeOut: userData.sessionTimeout,
              permissions: userData.permissions

            }
          }
          CurrentUser.saveCurrentUserData(obj);
        }

        showSnackbarAlret('User data Successfully Updated !', 'success');
        props.history.push("/menu/usersmanagement/allusers"); // redirect to login
      }
      else {      // if creating is failed 
        showSnackbarAlret('User data updating is failed ! , please try again...', 'success');
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
      height: '110vh'
    }}>

      <Box id="formBox"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
      >

        <form id="editUserForm" className={classes.root} noValidate autoComplete="off" onSubmit={e => checkInputs(e)}>


          <h2> Edit User: {userData.firstName} {userData.lastName} </h2>

          <TextField
            id="outlined-basic"
            label="First Name"
            variant="outlined"
            type="text"
            name="firstname"
            value={userData.firstName}
            error={firstNameError.isInvalid ? true : false}
            helperText={firstNameError.errorHelper}
            onChange={e => setUserData({ ...userData, firstName: e.target.value })}
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
            name="lastname"
            value={userData.lastName}
            error={lastNameError.isInvalid ? true : false}
            helperText={lastNameError.errorHelper}
            onChange={e => setUserData({ ...userData, lastName: e.target.value })}
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
            value={userData.username}
            error={useranmeError.isInvalid ? true : false}
            helperText={useranmeError.errorHelper}
            onChange={e => setUserData({ ...userData, username: e.target.value })}
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
            name="sess"
            value={userData.sessionTimeout}
            error={sessionTimeOutError.isInvalid ? true : false}
            helperText={sessionTimeOutError.errorHelper}
            onChange={e => setUserData({ ...userData, sessionTimeout: e.target.value })}
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
              value={userData.classification}
              label="Classification"
              onChange={e => setUserData({ ...userData, classification: e.target.value })}

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


          <h3> Permissons: </h3>

          <FormControlLabel control={<Checkbox />} label="View Subscriptions" id="view_subscriptions" name="ViewSubscriptions" value="View Subscriptions" checked={userData.permissions.includes("View Subscriptions") ? true : false} onChange={(e) => premissionsHandler(e)} />

          <FormControlLabel control={<Checkbox />} label="Create Subscriptions" id="create_sub" name="CreateSubscriptions" value="Create Subscriptions" checked={userData.permissions.includes("Create Subscriptions") ? true : false} onChange={e => premissionsHandler(e)} /><br />

          <FormControlLabel control={<Checkbox />} label="Delete Subscriptions" id="delete_sub" name="DeleteSubscriptions" value="Delete Subscriptions" checked={userData.permissions.includes("Delete Subscriptions") ? true : false} onChange={e => premissionsHandler(e)} />

          <FormControlLabel control={<Checkbox />} label="Update Subscriptions" id="update_sub" name="UpdateSubscriptions" value="Update Subscriptions" checked={userData.permissions.includes("Update Subscriptions") ? true : false} onChange={e => premissionsHandler(e)} /><br />

          <FormControlLabel control={<Checkbox />} label="View Movies" id="view_movie" name="ViewMovies" value="View Movies" checked={userData.permissions.includes("View Movies") ? true : false} onChange={(e) => premissionsHandler(e)} />

          <FormControlLabel control={<Checkbox />} label="Create Movies" id="create_movie" name="CreateMovies" value="Create Movies" checked={userData.permissions.includes("Create Movies") ? true : false} onChange={e => premissionsHandler(e)} /><br />

          <FormControlLabel control={<Checkbox />} label="Delete Movies" id="delete_movie" name="DeleteMovies" value="Delete Movies" checked={userData.permissions.includes("Delete Movies") ? true : false} onChange={e => premissionsHandler(e)} />

          <FormControlLabel control={<Checkbox />} label="Update Movies" id="update_movie" name="UpdateMovies" value="Update Movies" checked={userData.permissions.includes("Update Movies") ? true : false} onChange={e => premissionsHandler(e)} /><br />


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
            onClick={() => props.history.push("/menu/usersmanagement/allusers")}
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

export default withRouter(EditUser_Comp);