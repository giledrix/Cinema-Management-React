import * as React from 'react';
import '../../Style/allmovies.css';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useState, useEffect } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import Movie_Comp from './Movie'
import moviesBL from '../../BL/moviesBL';
import usersBL from '../../BL/usersBL';
import CurrentUser from '../../Utils/CurrentUser';
import Background from '../../Style/images/moviesBG.png';
import { useSnackbar } from 'notistack';


const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));



function AllMovies_Comp(props) {
  const [movies, setMovies] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  let { id } = useParams(); // Use for get parameter from url


  // Will run on first render and get all Movies data from WS and then store it in state 
  useEffect(async () => {

    if (CurrentUser.getPermission("View Movies")) { // Prevent appropriate permissions users to navigate Movies page via URL
      // Check if user token expired
      let resp = await usersBL.verifyUserToken();
      if (resp && resp.data.message === "jwt TokenExpiredError") {
        sessionStorage.clear();
        props.history.push('/');
      }
      else {
        let userToken = await CurrentUser.getSubscriptionsWSToken();

        if (userToken === undefined) {
          props.history.push('/');
        }
        else {
          if (id) {
            searchMovie(id); // Present specific movie (press on movie name in subscription)
          }
          else {
            getAllMovies();
          }
        }
      }

    }
    else {
      props.history.push('/menu/home');
    }


  }, []);

  const getAllMovies = async () => {
    let allMoviesArr = await moviesBL.getAllMoviesAndTheirSubscriptions();
    setMovies(allMoviesArr);
  }

  const searchMovie = async (id) => {
    let allMoviesArr = await moviesBL.getAllMoviesAndTheirSubscriptions();

    if (allMoviesArr) {
      let searchResult
      if (id) {
        searchResult = allMoviesArr.filter(movie => movie.Name.includes(id)); // Present movie 
      }
      else {
        searchResult = allMoviesArr.filter(movie => movie.Name.includes(searchInput)); // Check if movie name include the search input
      }
      setMovies(searchResult);
    }


  }



  return (
    <div >

      <input id="search" type="text" placeholder="Search movie.." onChange={e => setSearchInput(e.target.value)} /><input type="button" id="searchBtn" value="Search" onClick={() => searchMovie()} /> <br /><br />


      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {
            movies.map(movie => {

              return (
                <Grid item xs={2} sm={4} md={4} key={movie.id} >
                  <Item style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url(${Background})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',

                  }}>
                    <Movie_Comp key={movie.id} getAllMoviesCallBack={() => getAllMovies()} movieData={movie} />
                  </Item>
                </Grid>)

            })
          }
        </Grid>
      </Box>


    </div>
  );
}

export default withRouter(AllMovies_Comp);
