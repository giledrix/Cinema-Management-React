import '../../Style/user.css';
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
import { UsersContext } from './Context'
import usersBL from '../../BL/usersBL';
import { useSnackbar } from 'notistack';


const useStyles = makeStyles({
    root: {
        maxWidth: '40%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    media: {
        height: 50,
        backgroundColor: 'black',
        color: '#FFC107',
        fontSize: "40px"

    },
});


function User_Comp(props) {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [userData, setUserData] = useContext(UsersContext);


    const navToEditUser = () => {
        setUserData({ id: props.userData.id, username: props.userData.username, firstName: props.userData.firstName, lastName: props.userData.lastName, sessionTimeout: props.userData.sessionTimeOut, classification: props.userData.classification, permissions: props.userData.permissions })
        props.history.push('/menu/usersmanagement/edituser');
    }

    const deleteUser = async () => {

        let resp = await usersBL.deleteUser(props.userData.id);
        let status = resp.data.deleteStatus;

        if (status == "delete user failed") {
            showSnackbarAlret('Account deleting is Failed  , please try again', 'error');
        }
        else if (status == "OK") {
            showSnackbarAlret('Account Successfully Deleted !!', 'success');
        }

        props.getUsersCallback(); // get all users again (by using callback function) in -AllUsers- component for reRender.
    }

    const showSnackbarAlret = (message, variant) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant: variant });
      };


    return (
        <div>
            <Card className={classes.root} style={{ border: 'solid', backgroundColor: '#FFC107' }}>
                <CardActionArea>

                    <CardMedia className={classes.media}>
                        <div>{props.userData.firstName}  {props.userData.lastName} </div>
                    </CardMedia>
                    <CardContent>


                        <Typography id="body" variant="body2" color="textPrimary" component="div">
                            <b>Username :</b> {props.userData.username} <br /><br />
                            <b>Session Timeout :</b> {props.userData.sessionTimeOut} <br /><br />
                            <b>Created Date :</b> {props.userData.createdDate} <br /><br />
                            <fieldset style={{ borderColor: 'black', width: '85%' }}>
                                <b>Premissions :</b>
                                <ul>
                                    {props.userData.permissions.map(perm => {
                                        return <li key={perm}>{perm} </li>
                                    })}

                                </ul>

                            </fieldset>

                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions style={{ backgroundColor: 'black' }}>
                    <Button size="small" color="primary" onClick={() => navToEditUser()} style={{ color: '#FFC107' }}>
                        Edit
                    </Button>
                    <Button size="small" color="primary" onClick={() => deleteUser()} style={{ color: '#FFC107' }}>
                        Delete
                    </Button>
                </CardActions>
            </Card>

            <br/><br/>
        </div>

    );
}

export default withRouter(User_Comp);