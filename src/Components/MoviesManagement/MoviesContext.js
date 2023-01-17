import { createContext, useState } from "react";

//Create my context (for using context API)
export const MoviesContext = createContext();

export const MoviesDataContextProvider = props => {

    // Here i define in state all the data i want to share with every children's components
    const [movieData, setMovieData] = useState({ id: '', Name: '', Genres: [], Image: '', Premiered: '' });

    
    return (
        // pass pointer to movieData and setMovieData to all components
        <MoviesContext.Provider value={[movieData, setMovieData]}>

            {/* Its like all the other child components is here , because of that they all can access to same state  */}
            {props.children}

            {/* Thanks for "Composition" , in run-time all the child components locate here , and thats the reason they all
            can get and set data in the same state (the data is passed in the entire hierarchy, and then its possible to change him or present him.) */}
        </MoviesContext.Provider>
    )
}
