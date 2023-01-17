import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { SubscriptionsContext } from './SubscriptionsContext'
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import { MdMovieFilter } from 'react-icons/md';
import SubscriptionsBL from '../../BL/SubscriptionsBL';
import { useSnackbar } from 'notistack';

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


function NewSubscription_Comp(props) {
    const [memberData, setMemberData] = useContext(SubscriptionsContext);
    const [subscription, setSubscription] = useState({ movie: "", date: new Date() });
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();

    useEffect(async () => {
        let date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        setSubscription({ movie: props.moviesDropDown[0], date: year + "-" + month + "-" + day });
    }, []);

    const checkInputs = async (e) => {
        e.preventDefault(); // Prevent submit button to refresh page


        if (subscription.movie.length < 1) {
            alert("Please select a movie")
        }
        else if (subscription.date == null) {
            alert("Select date")
        }
        else { // All inputs are OK
            let resp = await SubscriptionsBL.createSubscription(subscription, props.memberID); // Send member data to WS
            let status = resp.data;

            if (status === "Subscription is Updated" || status === "The subscription was successfully registered") {
                memberData.getAllMembersCallBack();
                showSnackbarAlert('Subscription Successfully Created !!', 'success');
            }
            else {
                showSnackbarAlert('Subscription is Failed ..', 'error');
            }
        }
    }

    const showSnackbarAlert = (message, variant) => {
        // Variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant: variant });
    };


    return (
        <div >

            <fieldset style={{ borderColor: 'black' }}>
                Add a new movie: <br />

                <form onSubmit={e => checkInputs(e)}>
                    <select name="movie" id="movie" onChange={e => setSubscription({ ...subscription, movie: e.target.value })}
                    style= {{borderColor:'black' ,borderWidth:'2px',height:'30px'  ,backgroundColor:'#FFC107 '}}

                    >

                        {
                            props.moviesDropDown.map(movieList => {
                                return <option key={movieList._id} value={movieList._id}>{movieList.Name}</option>
                            })
                        }

                    </select>



                    <input type="date" id="date" name="date" value={subscription.date} onChange={e => setSubscription({ ...subscription, date: e.target.value })}
                    style= {{borderColor:'black' ,borderWidth:'2px',height:'25px'  ,backgroundColor:'#FFC107 '}} 
                    /> <br /><br />

                    
                    <Button
                        className={classes.root}
                        variant="contained"
                        color="primary"
                        size="large"
                        type="submit"
                        startIcon={<MdMovieFilter />}
                        style={{ minWidth: '100px', maxHeight: '30px', color: '#FFC107' }}
                    >
                        Subscribe
                    </Button><br />

                </form>

                <br />
            </fieldset>

        </div>
    );
}
export default NewSubscription_Comp;
