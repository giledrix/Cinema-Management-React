import { createContext, useState } from "react";

//create my context
export const SubscriptionsContext = createContext();
export const SubscriptionDataContextProvider = props => {

    // Define in state all the data i want to share with every child components
    const [memberData, setMemberData] = useState({ id: '', Name: '', Email: '', City: '', Subscriptions: [] });

    return (
        // pass pointer to memberData and setMemberData to all components
        <SubscriptionsContext.Provider value={[memberData, setMemberData]}>

            {/* Its like all the other child components is here , because of that they all can access to same state  */}
            {props.children}

            {/* Thanks for "Composition" , in run-time all the child components locate here , and thats the reason they all
            can get and set data in the same state (the data is passed in the entire hierarchy, and then its possible to change him or present him.) */}
        </SubscriptionsContext.Provider>
    )
}
