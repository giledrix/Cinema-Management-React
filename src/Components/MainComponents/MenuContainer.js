import { Switch, Route, Link, useRouteMatch, withRouter } from 'react-router-dom';
import UsersManagementContainer_Comp from '../UsersManagement/UsersManagementContainer';
import MoviesManagementContainer_Comp from '../MoviesManagement/MoviesManagementContainer';
import SubscriptionManagementContainer_Comp from '../SubscriptionManagement/SubscriptionManagmentContainer';
import CurrentUser from '../../Utils/CurrentUser';
import React from 'react';
import { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import MovieIcon from '@mui/icons-material/Movie';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import GroupIcon from '@mui/icons-material/Group';
import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useSnackbar } from 'notistack';
import Home_Comp from './Home';



const useStyles = makeStyles({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
});



function MenuContainer_Comp(props) {

    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const { enqueueSnackbar } = useSnackbar();
    let { path, url } = useRouteMatch();



    // Check if user is authenticate
    useEffect(async () => {

        let userToken = CurrentUser.getCinemaWSToken();

        if (userToken === undefined || userToken === null) {
            props.history.push('/');
        }
    }, []);


    const userLogout = () => {
        sessionStorage.clear();
        props.history.push('/');
        showSnackbarAlret('Logout from the system...', 'info');
    }

    const showSnackbarAlret = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant: variant });
    };



    return (



        <div>
            <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                showLabels
                className={classes.root}
            >

                <BottomNavigationAction label="Home" component={Link} to={path + "/home"} icon={<HomeIcon />} />
                {CurrentUser.getPermission("View Movies") ? <BottomNavigationAction label="Movies" component={Link} to={path + "/movies/allMovies"} icon={<MovieIcon />} /> : null}
                {CurrentUser.getPermission("View Subscriptions") ? <BottomNavigationAction label="Subscriptions" component={Link} to={path + "/SubscriptionManagement"} icon={<SubscriptionsIcon color="yellow" />} /> : null}
                {CurrentUser.getClassification() === "administrator" ? <BottomNavigationAction label="Users Management" component={Link} to={path + "/usersmanagement"} icon={<GroupIcon />} /> : null}
                <BottomNavigationAction onClick={() => userLogout()} label={"Logout(" + CurrentUser.getName() + ")"} icon={<ExitToAppIcon />} />
            </BottomNavigation>


            {/* Single Page Application */}
            <Switch>
                <Route path={path + "/movies"}>
                    <MoviesManagementContainer_Comp />
                </Route>
                <Route path={path + "/usersmanagement"}>
                    <UsersManagementContainer_Comp />
                </Route>
                <Route path={path + "/SubscriptionManagement"}>
                    <SubscriptionManagementContainer_Comp />
                </Route>
                <Route path={path + "/home"}>
                    <Home_Comp />
                </Route>
            </Switch>

        </div >

    );
}

export default withRouter(MenuContainer_Comp);