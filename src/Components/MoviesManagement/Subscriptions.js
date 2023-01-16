import React from 'react';
import { Link, withRouter } from 'react-router-dom';

function Subscriptions_Comp(props) {


    return (
        <div>
            <fieldset id="subscriptions_frame" style={{ borderColor: 'black' }}>
                <b>Subscriptions Watched : </b>

                <ul>
                    {
                        props.movieData.Watched.map((w, index) => {
                            return <li key={index}><Link to={"/menu/SubscriptionManagement/allMembers"} >{w.memberName}</Link> , {w.date} </li>
                        })
                    }

                </ul>

            </fieldset >

        </div>
    );
}

export default withRouter(Subscriptions_Comp);