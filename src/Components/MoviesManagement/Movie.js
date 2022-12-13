import '../../Style/movie.css';
import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router-dom';
import { useContext, useState } from 'react';
import { MoviesContext } from './MoviesContext'
import moviesBL from '../../BL/moviesBL';
import Subscriptions from './Subscriptions';
import { useSnackbar } from 'notistack';



const useStyles = makeStyles({
  root: {
    maxWidth: 300,
    minWidth: 300,
  },
  media: {

  },
});


function Movie_Comp(props) {
  const classes = useStyles();
  const [movieData, setMovieData] = useContext(MoviesContext);
  const { enqueueSnackbar } = useSnackbar();

  const navToEditMovie = () => {
    setMovieData({ id: props.movieData.id, Name: props.movieData.Name, Genres: props.movieData.Genres + "", Image: props.movieData.Image, Premiered: props.movieData.Premiered });
    props.history.push('/menu/movies/editMovie');
  }

  const deleteMovie = async () => {
    let resp = await moviesBL.deleteMovie(props.movieData.id);

    if (resp.data == "Movie is Deleted") {
      showSnackbarAlret('Movie deleted !!', 'success');
    }
    else {
      showSnackbarAlret('Delete movie is failed...!', 'error');
    }

    props.getAllMoviesCallBack(); // get all  movies again (by using callback function) in -AllUsers- component for reRender.
  }

  const showSnackbarAlret = (message, variant) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(message, { variant: variant });
  };


  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Card className={classes.root} style={{ border: 'solid', backgroundColor: '#FFC107' }}>
        <CardActionArea >
          <CardMedia
            className={classes.media}
            component="img"
            image={props.movieData.Image}

          />

          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              <b>  {props.movieData.Name} , {props.movieData.Premiered.substring(0, 4)}</b>
            </Typography>
            <div id="geners">
              <b>Geners : </b><br />

              {
                props.movieData.Genres.map((genre, i) => {
                  if (i + 1 === props.movieData.Genres.length) {
                    return "\"" + genre + "\" ";
                  }
                  else {
                    return "\"" + genre + "\" ,";
                  }

                })
              }

              <br /><br />

              <Subscriptions movieData={props.movieData} />
            </div>
          </CardContent>
        </CardActionArea>
        <CardActions style={{ backgroundColor: 'black' }} >
          <Button size="small" color="primary" onClick={() => navToEditMovie()} style={{ color: '#FFC107' }}>
            Edit
          </Button>
          <Button size="small" color="primary" onClick={() => deleteMovie()} style={{ color: '#FFC107' }}>
            Delete
          </Button>
        </CardActions>
      </Card>

      <br /><br />

    </div>
  );
}

export default withRouter(Movie_Comp);