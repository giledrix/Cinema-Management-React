import { createContext, useState } from "react";

//create my contect
export const SubscriptionsContext = createContext();

export const SubscriptionDataContextProvider = props => {

    // here i define in state all the data i want to share with every components
    const [memberData, setMemberData] = useState({ id: '', Name: '', Email: '', City: '', Subscribtions: [] });

    return (
        // pass pointer to counter and setCounder to all components
        <SubscriptionsContext.Provider value={[memberData, setMemberData]}>

            {/* // זה כאילו 2 הקומפוננטים נמצאים פה ובגלל זה הם יכולים לשמשתמש באותו סטייט */}
            {props.children}

            {/* בזכות הקומוזישן בזן ריצה 2 הקומפוננטות מגיעות לפה ולכן לשניהם 
            יש גישה לקאונטר ולסט קאונטר שהמידע הזזה מחלחל בכל ההיררכיה ולכן כל אחד יכל לשנות את הקאונטר ולהציג אותו */}
        </SubscriptionsContext.Provider>
    )
}
