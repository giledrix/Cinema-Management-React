import { createContext, useState } from "react";

//create my contect
export const UsersContext = createContext();

export const UsersDataContextProvider = props => {

    // here i define in state all the data i want to share with every components
    const [userData, setUserData] = useState({ id: '', username: '', firstName: '', lastName: '', sessionTimeout: 0, classification: "user", permissions: [] });

    return (
        // pass pointer to counter and setCounder to all components
        <UsersContext.Provider value={[userData, setUserData]}>

            {/* // זה כאילו 2 הקומפוננטים נמצאים פה ובגלל זה הם יכולים לשמשתמש באותו סטייט */}
            {props.children}

            {/* בזכות הקומוזישן בזן ריצה 2 הקומפוננטות מגיעות לפה ולכן לשניהם 
            יש גישה לקאונטר ולסט קאונטר שהמידע הזזה מחלחל בכל ההיררכיה ולכן כל אחד יכל לשנות את הקאונטר ולהציג אותו */}
        </UsersContext.Provider>
    )
}