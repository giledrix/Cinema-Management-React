import React from 'react';
import Button from '@mui/material/Button';
import NewSubscription_Comp from './NewSubscription';
import { useState } from 'react';
import { Link,withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    root: {
        // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        background: 'linear-gradient(45deg, #1c1b1b 30%, #000000 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 48,
        padding: '0 30px',

    },
});


function MovieWatched_Comp(props) {
    const [showNewSubscribe, setShowNewSubscribe] = useState(false);
    const classes = useStyles();

    

    return (
        <div>
            <fieldset id="subscriptions_frame" style = {{borderColor: 'black'}}>
                <b>Movies Watched : </b> <br />

            


                <Button className={classes.root} variant="outlined"  size="small" onClick={() => setShowNewSubscribe(!showNewSubscribe)} style={{ minWidth: '100px', maxHeight: '30px', color: '#FFC107' }} >
                    Subscribe to new movie
                </Button>
                
                <br /><br />

                {
                    showNewSubscribe && <NewSubscription_Comp memberID={props.memberID} moviesDropDown={props.subscriptions.moviesDropDown} />
                }

                
                <ul>
                    {
                        props.subscriptions.subscriptionsMovies.map((subsc,index) => {
                            return <li key={index}><Link to={"/menu/movies/allMovies/" + subsc.name} >{subsc.name}</Link> , {subsc.date} </li>
                        })
                    }

                </ul>

            </fieldset >

        </div>
    );
}

export default withRouter(MovieWatched_Comp);