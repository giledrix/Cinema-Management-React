import { SubscriptionDataContextProvider } from './SubscriptionsContext'
import { Switch, Route, Link, useRouteMatch, withRouter, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AllMembers_Comp from './AllMembers';
import EditMember_Comp from './EditMember';
import AddMember_Comp from './AddMember';
import NewSubscription_Comp from './NewSubscription';
import usersBL from '../../BL/usersBL';
import CurrentUser from '../../Utils/CurrentUser';
import SubsLogo from '../../Style/images/SubscribeLogo.png';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import { useSnackbar } from 'notistack';

// Theme for nav sub-menu
const theme = createTheme({
  palette: {
    selected: {
      main: "#FFC107", // Button background color
      contrastText: "#000000" //Button text color
    },
    unSelected: {
      main: "#000000", // Button background color
      contrastText: "#FFC107" //Button text color
    },
  }
});



function SubscriptionManagementContainer_Comp(props) {
  const [allMembersSelected, setAllMembersSelected] = useState(true);
  const [addMemberSelected, setAddMemberSelected] = useState(false);
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  let { path, url } = useRouteMatch();

  // Check if user is authenticate (run in first render AND also when location change)
  useEffect(async () => {

    if (CurrentUser.getPermission("View Subscriptions")) {// Prevent appropriate permissions users to navigate Subscription page via URL
      // Check if User Token is valid(expired etc..)
      let resp = await usersBL.verifyUserToken();

      if (resp) {
        if (resp.data.message === "jwt TokenExpiredError" || resp.data.message === "No token provided." || resp.data.message === "Failed to authenticate token") {
          sessionStorage.clear();
          showSnackbarAlert('Token is invalid or expired', 'error');
          props.history.push('/');
        }
        else {
          props.history.push(url + "/allMembers");
        }
      }
      else {
        showSnackbarAlert('Token is invalid', 'error');
        props.history.push('/');
      }
    }
    else {
      props.history.push('/menu/home');
    }

  }, []);

  const navigateToAllMembers = () => {
    setAllMembersSelected(true);
    setAddMemberSelected(false);
    props.history.push(url + "/allMembers");
  }

  const navigateAddMember = () => {
    setAllMembersSelected(false);
    setAddMemberSelected(true);
    props.history.push(url + "/addmember");
  }

  const showSnackbarAlert = (message, variant) => {
    // Variant could be success, error, warning, info, or default
    enqueueSnackbar(message, { variant: variant });
  };

  return (
    <div style={{
      backgroundColor: '#1a415c',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      height: '100vh'
    }}>

      <img src={SubsLogo} alt="SubscLogo" width="700px" /> <br /><br />

      <ThemeProvider theme={theme}>
        <ButtonGroup disableElevation variant="contained">
          <Button color={allMembersSelected ? "selected" : "unSelected"} value="allMembers" onClick={() => navigateToAllMembers()}>All Members</Button>
          {CurrentUser.getPermission("Create Subscriptions") ? <Button color={addMemberSelected ? "selected" : "unSelected"} value="addMember" onClick={() => navigateAddMember()} >Add Member   </Button> : null}
        </ButtonGroup>
      </ThemeProvider>

      <br /><br /><br />


      {/* Using ContextAPI set main container as provider that host all other child's components(using composition) */}
      <SubscriptionDataContextProvider>

        <Switch>
          <Route path={path + "/allMembers"}>
            <AllMembers_Comp />
          </Route>
          <Route path={path + "/editmember"}>
            <EditMember_Comp />
          </Route>
          <Route path={path + "/addmember"}>
            <AddMember_Comp />
          </Route>
          <Route path={path + "/subscribe"}>
            <NewSubscription_Comp />
          </Route>

        </Switch>

      </SubscriptionDataContextProvider>

    </div>
  );
}

export default withRouter(SubscriptionManagementContainer_Comp);