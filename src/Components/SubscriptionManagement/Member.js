import { SubscriptionsContext } from './SubscriptionsContext'
import CurrentUser from '../../Utils/CurrentUser';
import { useContext, useEffect } from 'react';
import '../../Style/user.css';
import { withRouter } from 'react-router-dom';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MovieWatched from './MovieWatched';
import SubscriptionsBL from '../../BL/SubscriptionsBL';
import { useSnackbar } from 'notistack';




function Member_Comp(props) {
    const [memberData, setMemberData] = useContext(SubscriptionsContext);
    const { enqueueSnackbar } = useSnackbar();

    // will run ONLY on first render 
    useEffect(async () => {
        setMemberData({ ...memberData, getAllMembersCallBack: props.getAllMembersCallBack });
    }, []) // empty dependency list


    const navToEditMember = () => {
        setMemberData({ id: props.memberData.id, Name: props.memberData.Name, Email: props.memberData.Email, City: props.memberData.City, getAllMembersCallBack: props.getAllMembersCallBack });
        props.history.push('/menu/SubscriptionManagement/editmember');
    }

    const deleteMember = async () => {
        let resp = await SubscriptionsBL.deleteMember(props.memberData.id)

        if (resp.data === "Member is Deleted") {
            showSnackbarAlret('Member is Deleted !!', 'success');
        }
        else {
            showSnackbarAlret('Delete member is failed..', 'error');
        }

        props.getAllMembersCallBack(); // get all  Member again (by using callback function) in -AllMembers- component for Rerender.(); 
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

            <Box sx={{
                width: '46%', display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
            }}>
                <Card style={{ border: 'solid', backgroundColor: '#FFC107' }}>

                    <React.Fragment>
                        <CardContent>

                            <Typography id="name" variant="h5" component="h1">
                                {props.memberData.Name}
                            </Typography>
                            <Typography id="body" sx={{ mb: 1.5 }} color="text.primary" component="div">
                                <br />
                                <b>Email :</b> {props.memberData.Email} <br />
                                <b>City :</b> {props.memberData.City}<br /><br />

                                <MovieWatched memberID={props.memberData.id} subscriptions={props.memberData.Subscribtions} />

                            </Typography>
                        </CardContent>
                        <CardActions style={{ backgroundColor: 'black' }} >
                            {CurrentUser.getPermission("Update Subscriptions") ? <Button size="small" onClick={() => navToEditMember()} style={{ color: '#FFC107' }}>Edit</Button> : null}
                            {CurrentUser.getPermission("Delete Subscriptions") ? <Button size="small" onClick={() => deleteMember()} style={{ color: '#FFC107' }}>Delete</Button> : null}
                        </CardActions>
                    </React.Fragment>
                </Card>
            </Box>

            <br /><br />


        </div>
    );
}

export default withRouter(Member_Comp);