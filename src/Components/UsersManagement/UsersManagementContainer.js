import { UsersDataContextProvider } from './Context'
import { Switch, Route, Link, useRouteMatch, withRouter, useLocation } from 'react-router-dom';
import AddUser_Comp from './AddUser';
import AllUsers_Comp from './AllUsers';
import EditUser_Comp from './EditUser';
import { useEffect, useState } from 'react';
import CurrentUser from '../../Utils/CurrentUser';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import usersBL from '../../BL/usersBL';
import usersLogo from '../../Style/images/usersLogo.png';
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import { useSnackbar } from 'notistack';

// theme for nav sub-menu
const theme = createTheme({
  palette: {
    selected: {
      main: "#FFC107", // Button background color
      contrastText: "#000000" //button text folor
    },
    unSelected: {
      main: "#000000", // Button background color
      contrastText: "#FFC107" //button text folor
    },
  }
});


function UsersManagementContainer_Comp(props) {
  const [allUsersSelected, setAllUsersSelected] = useState(true);
  const [addUserSelected, setAddUserSelected] = useState(false);
  let { path, url } = useRouteMatch();
  const { enqueueSnackbar } = useSnackbar();

  // check if user is authenticate (run in first render AND also when location change)
  useEffect(async () => {

    // Prevent appropriate permissions users to naviagte User Managment page via URL
    let classification = CurrentUser.getClassification();

    if (classification != "administrator") {
      props.history.push('/menu/home');
    }
    else {
      // Check if User Token is valid(expired etc..)
      let resp = await usersBL.verifyUserToken();

      if (resp) {
        if (resp.data.message == "jwt TokenExpiredError" || resp.data.message == "No token provided." || resp.data.message == "Failed to authenticate token") {
          sessionStorage.clear();
          showSnackbarAlret('Token is invalid or expired', 'error');
          props.history.push('/');
        }
        else {
          props.history.push(url + "/allusers");
        }
      }
      else {
        showSnackbarAlret('Token is invalid', 'error');
        props.history.push('/');
      }
    }


  }, []);

  const navigateToAllUsers = () => {
    setAllUsersSelected(true);
    setAddUserSelected(false);
    props.history.push(url + "/allusers");
  }

  const navigateToAddUser = () => {
    setAllUsersSelected(false);
    setAddUserSelected(true);
    props.history.push(url + "/adduser");
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

    }}>

      <img src={usersLogo} alt="Movielogo" width="700px" /> <br /><br />

      <ThemeProvider theme={theme}>
        <ButtonGroup disableElevation variant="contained">
          <Button color={allUsersSelected ? "selected" : "unSelected"} value="allUsers" onClick={() => navigateToAllUsers()}>All Users</Button>
          <Button color={addUserSelected ? "selected" : "unSelected"} value="addUser" onClick={() => navigateToAddUser()} >Add User  </Button>
        </ButtonGroup>
      </ThemeProvider>

      <br /><br /><br />


      <UsersDataContextProvider>

        <Switch>
          <Route path={path + "/allusers"}>
            <AllUsers_Comp />
          </Route>
          <Route path={path + "/adduser"}>
            <AddUser_Comp />
          </Route>
          <Route path={path + "/edituser"}>
            <EditUser_Comp />
          </Route>
        </Switch>

      </UsersDataContextProvider>


    </div>
  );
}


export default withRouter(UsersManagementContainer_Comp);