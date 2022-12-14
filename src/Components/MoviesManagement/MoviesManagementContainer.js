
import { MoviesDataContextProvider } from './MoviesContext'
import { Switch, Route, Link, useRouteMatch, withRouter, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AllMovies_Comp from './AllMovies';
import AddMovie_Comp from './AddMovie';
import EditMovie_Comp from './EditMovie';
import usersBL from '../../BL/usersBL';
import MoviesLogo from '../../Style/images/moviesLogo.png';
import CurrentUser from '../../Utils/CurrentUser';
import { createTheme, ThemeProvider } from "@mui/material/styles";
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


function MoviesManagementContainer_Comp(props) {
  const [allMoviedSelected, setAllMoviesSelected] = useState(true);
  const [addMovieSelected, setAddMovieSelected] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  let { path, url } = useRouteMatch();

  // check if user is authenticate (run in first render AND also when location change)
  useEffect(async () => {


    if (CurrentUser.getPermission("View Movies")) { // Prevent appropriate permissions users to naviagte Movies page via URL
      // Check if User Token is valid(expired etc..)
      let resp = await usersBL.verifyUserToken();

      if (resp) {
        if (resp.data.message == "jwt TokenExpiredError" || resp.data.message == "No token provided." || resp.data.message == "Failed to authenticate token") {
          sessionStorage.clear();
          showSnackbarAlret('Token is invalid or expired', 'error');
          props.history.push('/');
        }
        else {
          props.history.push(url + "/allMovies");
        }
      }
      else {
        showSnackbarAlret('Token is invalid', 'error');
        props.history.push('/');
      }

    }
    else {
      props.history.push('/menu/home');
    }


  }, []);

  const navigateToAllMovies = () => {
    setAllMoviesSelected(true);
    setAddMovieSelected(false);
    props.history.push(url + "/allMovies");
  }

  const navigateAddMovie = () => {
    setAllMoviesSelected(false);
    setAddMovieSelected(true);
    props.history.push(url + "/addMovies");
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

      <br />

      <img src={MoviesLogo} alt="Movielogo" width="700px" /> <br /><br />


      <ThemeProvider theme={theme}>
        <ButtonGroup disableElevation variant="contained">
          <Button color={allMoviedSelected ? "selected" : "unSelected"} value="allMovies" onClick={() => navigateToAllMovies()}>All Movies</Button>
          {/* <Button color={addMovieSelected ? "selected" : "unSelected"} value="addMovie" onClick={() => navigateAddMovie()} >Add Movie  </Button> */}
          {CurrentUser.getPermission("Create Movies") ? <Button color={addMovieSelected ? "selected" : "unSelected"} value="addMovie" onClick={() => navigateAddMovie()} >Add Movie  </Button> : null}
        </ButtonGroup>
      </ThemeProvider>


      <br /><br />

      <MoviesDataContextProvider>

        <Switch>
          <Route path={path + "/allMovies/:id"}>
            <AllMovies_Comp />
          </Route>
          <Route path={path + "/allMovies"}>
            <AllMovies_Comp />
          </Route>
          <Route path={path + "/addMovies"}>
            <AddMovie_Comp />
          </Route>
          <Route path={path + "/editMovie"}>
            <EditMovie_Comp />
          </Route>

        </Switch>

      </MoviesDataContextProvider>


    </div>
  );
}


export default withRouter(MoviesManagementContainer_Comp);