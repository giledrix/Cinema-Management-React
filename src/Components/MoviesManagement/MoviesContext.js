import { createContext, useState } from "react";

//create my contect
export const MoviesContext = createContext();

export const MoviesDataContextProvider = props => {

    // here i define in state all the data i want to share with every components
    const [movieData, setMovieData] = useState({ id: '', Name: '', Genres: [], Image: '', Premiered: '' });

    return (
        // pass pointer to counter and setCounder to all components
        <MoviesContext.Provider value={[movieData, setMovieData]}>

            {/* // זה כאילו 2 הקומפוננטים נמצאים פה ובגלל זה הם יכולים לשמשתמש באותו סטייט */}
            {props.children}

            {/* בזכות הקומוזישן בזן ריצה 2 הקומפוננטות מגיעות לפה ולכן לשניהם 
            יש גישה לקאונטר ולסט קאונטר שהמידע הזזה מחלחל בכל ההיררכיה ולכן כל אחד יכל לשנות את הקאונטר ולהציג אותו */}
        </MoviesContext.Provider>
    )
}
