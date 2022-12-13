import axios from 'axios'
import CurrentUser from '../Utils/CurrentUser'

const moviesWS_url = "http://localhost:8000/api/movies"
const subscriptionsWS_url = "http://localhost:8000/api/subscriptions"
const membersWS_url = "http://localhost:8000/api/members"



const getAllMoviesAndtheirSubscriptions = async () => {
    let respFromMoviesWS, respFromSubscriptionsWS, respFromMembersWS;
    let allSubscriptionsArr, allMembersArr, allMoviesArr;

    try {
       

        // get all movies from web service database
        respFromMoviesWS = await axios.get(moviesWS_url, {
            headers: { 'x-access-token': CurrentUser.getSubscribtionsWSToken() }

        });

        // get all Subscriptions from web service database
        respFromSubscriptionsWS = await axios.get(subscriptionsWS_url, {
            headers: { 'x-access-token': CurrentUser.getSubscribtionsWSToken() }

        });

        // get all Members from web service database
        respFromMembersWS = await axios.get(membersWS_url, {
            headers: { 'x-access-token': CurrentUser.getSubscribtionsWSToken() }
        });
    }
    catch (err) {
        console.log(err);
    }


    allMoviesArr = respFromMoviesWS.data.movies;
    allMembersArr = respFromMembersWS.data;
    allSubscriptionsArr = respFromSubscriptionsWS.data;

    let allMoviesWithSubscriptions = [];

    // data shaping from 3 sources (movie WS,Member WS , SubscriptionsWS)
    allMoviesArr.forEach(movie => {

        let allMovieSubscribtions = [];

        allSubscriptionsArr.forEach(subsc => {

            subsc.Movies.forEach(s => {
                if (s.movieID === movie._id) { // if member watch this movie

                    let member = allMembersArr.find(m => m._id === subsc.MemberID); // (for member name)

                    let memberObj = {
                        memberName: member.Name,
                        date: s.date
                    }
                    allMovieSubscribtions.push(memberObj);
                }
            });
        });

        let MovieObJ = {
            id: movie._id,
            Name: movie.Name,
            Premiered: movie.Premiered.substring(0, 10),
            Image: movie.Image,
            Genres: movie.Genres,
            Watched: allMovieSubscribtions
        }

        allMovieSubscribtions = [];
        allMoviesWithSubscriptions.push(MovieObJ);

    });

    return (allMoviesWithSubscriptions);
}

const addMovie = async function (input) {

    let genresArry = input.genres.split(','); // convert string to array

    let movieObj = {                 // create movie obj with all inputed data
        Name: input.name,
        Genres: genresArry,
        Image: input.imgUrl,
        Premiered: input.premired

    }

    let result = await axios.post(moviesWS_url, { Name: movieObj.Name, Genres: movieObj.Genres, Image: movieObj.Image, Premiered: movieObj.Premiered }, {
        headers: { 'x-access-token': CurrentUser.getSubscribtionsWSToken() }
    });

    return result.data;
}

const updateMovie = async function (movieID, input) {

    let genresArry = input.Genres.split(','); // convert string to array of strings

    let movieObj = {                         // // create movie obj with all inputed data
        Name: input.Name,
        Genres: genresArry,
        Image: input.Image,
        Premiered: input.Premiered

    }



    let result = await axios.put(moviesWS_url + "/" + movieID, { Name: movieObj.Name, Genres: movieObj.Genres, Image: movieObj.Image, Premiered: movieObj.Premiered }, {
        headers: { 'x-access-token': CurrentUser.getSubscribtionsWSToken() }
    });

    return result.data;
}

const deleteMovie = async function (movieID) {

    let respFromMoviesWS;
    let respFromSubscriptionWS;

    respFromMoviesWS = await axios.delete(moviesWS_url + "/" + movieID, {
        headers: { 'x-access-token': CurrentUser.getSubscribtionsWSToken() }
    });

    if (respFromMoviesWS.data === "Movie is Deleted") {
        respFromSubscriptionWS = await axios.get(subscriptionsWS_url, {
            headers: { 'x-access-token': CurrentUser.getSubscribtionsWSToken() }

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
                        headers: { 'x-access-token': CurrentUser.getSubscribtionsWSToken() }
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
                    MemmberID: s.MemberID,
                    Movies: s.Movies
                }
                try {
                    result = await axios.post(subscriptionsWS_url, { MemberID: subscriptionObJ.MemmberID, Movies: subscriptionObJ.Movies }, {
                        headers: { 'x-access-token': CurrentUser.getSubscribtionsWSToken() }
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

export default { getAllMoviesAndtheirSubscriptions, addMovie, updateMovie, deleteMovie }