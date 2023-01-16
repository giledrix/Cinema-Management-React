import axios from 'axios'
import CurrentUser from '../Utils/CurrentUser'

const moviesWS_url = "http://localhost:8000/api/movies"
const subscriptionsWS_url = "http://localhost:8000/api/subscriptions"
const membersWS_url = "http://localhost:8000/api/members"


const getAllMoviesAndTheirSubscriptions = async () => {
    let respFromMoviesWS, respFromSubscriptionsWS, respFromMembersWS;
    let allSubscriptionsArr, allMembersArr, allMoviesArr;

    try {
        // Get all movies from web service database
        respFromMoviesWS = await axios.get(moviesWS_url, {
            headers: { 'x-access-token': CurrentUser.getSubscriptionsWSToken() }

        });

        // Get all Subscriptions from web service database
        respFromSubscriptionsWS = await axios.get(subscriptionsWS_url, {
            headers: { 'x-access-token': CurrentUser.getSubscriptionsWSToken() }

        });

        // Get all Members from web service database
        respFromMembersWS = await axios.get(membersWS_url, {
            headers: { 'x-access-token': CurrentUser.getSubscriptionsWSToken() }
        });
    }
    catch (err) {
        console.log(err);
    }


    allMoviesArr = respFromMoviesWS.data.movies;
    allMembersArr = respFromMembersWS.data;
    allSubscriptionsArr = respFromSubscriptionsWS.data;

    let allMoviesWithSubscriptions = [];

    // Data shaping from 3 sources (movie WS,Member WS , SubscriptionsWS)
    allMoviesArr.forEach(movie => {

        let allMovieSubscriptions = [];

        allSubscriptionsArr.forEach(subsc => {

            subsc.Movies.forEach(s => {
                if (s.movieID === movie._id) { // if member watch this movie

                    let member = allMembersArr.find(m => m._id === subsc.MemberID); // (for member name)

                    let memberObj = {
                        memberName: member.Name,
                        date: s.date
                    }
                    allMovieSubscriptions.push(memberObj);
                }
            });
        });

        let MovieObJ = {
            id: movie._id,
            Name: movie.Name,
            Premiered: movie.Premiered.substring(0, 10),
            Image: movie.Image,
            Genres: movie.Genres,
            Watched: allMovieSubscriptions
        }

        allMovieSubscriptions = []; // RESET
        allMoviesWithSubscriptions.push(MovieObJ);

    });

    return (allMoviesWithSubscriptions);
}

const addMovie = async function (input) {

    let genresArray = input.genres.split(','); // Convert string to array

    let movieObj = {                 // Create movie obj with all inputted data
        Name: input.name,
        Genres: genresArray,
        Image: input.imgUrl,
        Premiered: input.premiered

    }

    let result = await axios.post(moviesWS_url, { Name: movieObj.Name, Genres: movieObj.Genres, Image: movieObj.Image, Premiered: movieObj.Premiered }, {
        headers: { 'x-access-token': CurrentUser.getSubscriptionsWSToken() }
    });

    return result.data;
}

const updateMovie = async function (movieID, input) {

    let genresArray = input.Genres.split(','); // Convert string to array of strings

    let movieObj = {                         // // Create movie obj with all inputted data
        Name: input.Name,
        Genres: genresArray,
        Image: input.Image,
        Premiered: input.Premiered

    }


    let result = await axios.put(moviesWS_url + "/" + movieID, { Name: movieObj.Name, Genres: movieObj.Genres, Image: movieObj.Image, Premiered: movieObj.Premiered }, {
        headers: { 'x-access-token': CurrentUser.getSubscriptionsWSToken() }
    });

    return result.data;
}

const deleteMovie = async function (movieID) {

    let respFromMoviesWS;
    let respFromSubscriptionWS;

    respFromMoviesWS = await axios.delete(moviesWS_url + "/" + movieID, {
        headers: { 'x-access-token': CurrentUser.getSubscriptionsWSToken() }
    });

    if (respFromMoviesWS.data === "Movie is Deleted") {
        respFromSubscriptionWS = await axios.get(subscriptionsWS_url, {
            headers: { 'x-access-token': CurrentUser.getSubscriptionsWSToken() }

        });
        let allSubscriptionsArr = respFromSubscriptionWS.data;

        if (allSubscriptionsArr) {

            allSubscriptionsArr.forEach(subsc => {

                subsc.Movies.forEach(function (movie, index, object) {
                    if (movie.movieID === movieID) {
                        object.splice(index, 1);
                    }
                });
            });

            allSubscriptionsArr.forEach(async s => {

                let status;
                try {
                    status = await axios.delete(subscriptionsWS_url + "/" + s._id, {
                        headers: { 'x-access-token': CurrentUser.getSubscriptionsWSToken() }
                    });
                }
                catch (err) {
                    console.log(err);
                    return ("Delete movies is failed please try again");
                }
            });


            let result;

            allSubscriptionsArr.forEach(async s => {

                let subscriptionObJ = {
                    MemberID: s.MemberID,
                    Movies: s.Movies
                }
                try {
                    result = await axios.post(subscriptionsWS_url, { MemberID: subscriptionObJ.MemberID, Movies: subscriptionObJ.Movies }, {
                        headers: { 'x-access-token': CurrentUser.getSubscriptionsWSToken() }
                    });
                }
                catch (err) {
                    console.log(err);
                    return ("Delete movies is failed please try again");
                }
            });

            return respFromMoviesWS;
        }

    }
    else {
        alert("Delete movies is failed please try again");
        return ("Delete movies is failed please try again");
    }
}

export default { getAllMoviesAndTheirSubscriptions, addMovie, updateMovie, deleteMovie }