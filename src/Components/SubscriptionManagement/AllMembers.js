import { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import SubscriptionsBL from '../../BL/SubscriptionsBL';
import CurrentUser from '../../Utils/CurrentUser';
import usersBL from '../../BL/usersBL';
import { useSnackbar } from 'notistack';

import Member_Comp from './Member';




function AllMembers_Comp(props) {

  const [members, setMembers] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  // will run on first render and get all users data from all sources and then store the data in state 
  useEffect(async () => {

    if (CurrentUser.getPermission("View Subscriptions")) { // Prevent appropriate permissions users to naviagte sunscriptions page via URL
      // Check if User Token is valid(expired etc..)
      let resp = await usersBL.verifyUserToken();

      if (resp) {
        if (resp.data.message == "jwt TokenExpiredError" || resp.data.message == "No token provided." || resp.data.message == "Failed to authenticate token") {
          sessionStorage.clear();
          showSnackbarAlret('Token is invalid or expired', 'error');
          props.history.push('/');
        }
        else {
          getAllMembers();
        }
      }
      else {
        props.history.push('/');
      }

    }
    else {
      props.history.push('/menu');
    }
  }, []);


  const getAllMembers = async () => {
    let resp = await SubscriptionsBL.getAllMembersIncludeSubscribtions();
    setMembers(resp);
  }

  const showSnackbarAlret = (message, variant) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(message, { variant: variant });
  };





  return (
    <div >

      {
        members.map(member => {
          return (<Member_Comp key={member.id} getAllMembersCallBack={() => getAllMembers()} memberData={member} />)

        })
      }

    </div>
  );
}

export default withRouter(AllMembers_Comp);