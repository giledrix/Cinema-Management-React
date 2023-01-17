import { createContext, useState } from "react";



//create my Context
export const UsersContext = createContext();

export const UsersDataContextProvider = props => {

    // Define in state all the data i want to share with every components
    const [userData, setUserData] = useState({ id: '', username: '', firstName: '', lastName: '', sessionTimeout: 0, classification: "user", permissions: [] });

    return (
        // Passing pointer to userData and setUserData to all components
        <UsersContext.Provider value={[userData, setUserData]}>

            {/* Its like all the other child components is here , because of that they all can access to same state  */}
            {props.children}

            {/* Thanks for "Composition" , in run-time all the child components locate here , and thats the reason they all
            can get and set data in the same state (the data is passed in the entire hierarchy, and then its possible to change him or present him.) */}
        </UsersContext.Provider>
    )
}
