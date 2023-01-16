import { useState, useEffect } from 'react';
import usersBL from '../../BL/usersBL';
import CurrentUser from '../../Utils/CurrentUser';
import User_Comp from './User';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';

function AllUsers_Comp(props) {

  const [users, setUsers] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  // will run on first render and get all users data from all sources and then store the data in state 
  useEffect(async () => {
    let classification = CurrentUser.getClassification();

    if (classification != "administrator") {// Prevent appropriate permissions users to navigate User Management page via URL
      props.history.push('/menu/home');
    }
    else {
      let resp = await usersBL.verifyUserToken();

      // Check User Token
      if (resp && resp.data.message === "jwt TokenExpiredError") {
        sessionStorage.clear();
        showSnackbarAlert('Session is timeout!!', 'error');
        props.history.push('/');
        
      }
      else {
        getAllUsers();
      }

    }

  }, []);


  const getAllUsers = async () => {

    let resp = await usersBL.getAllUsersDataFromAllSources();
    setUsers(resp.data.users.users);

  }

  const showSnackbarAlert = (message, variant) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(message, { variant: variant });
  };


  return (
    <div >

      {
        users.map(user => {
          return <User_Comp key={user.id} getUsersCallback={() => getAllUsers()} userData={user} />
        })
      }


    </div>
  );
}

export default withRouter(AllUsers_Comp);