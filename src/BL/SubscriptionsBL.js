import axios from 'axios'
import CurrentUser from '../Utils/CurrentUser'


const moviesWS_url = "http://localhost:8000/api/movies"
const subscriptionsWS_url = "http://localhost:8000/api/subscriptions"
const membersWS_url = "http://localhost:8000/api/members"


const getAllMembersIncludeSubscriptions = async function () {

    let respFromMoviesWS, respFromMemberWS, respFromSubscriptionsWS
    let allMoviesArr, allMembersArr, allSubscriptionsArr;

    try {

        respFromMemberWS = await axios.get(membersWS_url, {
            headers: { 'x-access-token': CurrentUser.getSubscriptionsWSToken() }
        });
        allMembersArr = respFromMemberWS.data;

        respFromMoviesWS = await axios.get(moviesWS_url, {
            headers: { 'x-access-token': CurrentUser.getSubscriptionsWSToken() }
        });
        allMoviesArr = respFromMoviesWS.data.movies;

        respFromSubscriptionsWS = await axios.get(subscriptionsWS_url, {
            headers: { 'x-access-token': CurrentUser.getSubscriptionsWSToken() }
        });
        allSubscriptionsArr = respFromSubscriptionsWS.data;
    }
    catch (err) {
        console.log(err);
    }

    // Data shaping from 3 sources (movie WS,Member WS , SubscriptionsWS)
    let allMembersWithSubs = [];

    allMembersArr.forEach(member => {

        let subscription = allSubscriptionsArr.find(subs => subs.MemberID === member._id);

        let moviesWatches = [];

        if (subscription) { // if the subscriber watched the movie

            let movies = allMoviesArr;

            subscription.Movies.forEach(movie => {

                let movie1 = allMoviesArr.find(m => m._id === movie.movieID); // For getting the movie name

                let movieObj = {
                    movieID: movie.movieID,
                    name: movie1.Name,
                    date: movie.date
                }

                movies = movies.filter(movie2 => movie2._id !== movie.movieID);

                moviesWatches.push(movieObj);

            });

            let memberObj = {
                id: member._id,
                Name: member.Name,
                Email: member.Email,
                City: member.City,
                Subscriptions:
                {
                    subscriptionsMovies: moviesWatches,
                    moviesDropDown: movies
                }

            }

            allMembersWithSubs.push(memberObj);
        }
        else { //if the subscriber did not watch the movie
            let memberObj = {
                id: member._id,
                Name: member.Name,
                Email: member.Email,
                City: member.City,
                Subscriptions:
                {
                    subscriptionsMovies: moviesWatches,
                    moviesDropDown: allMoviesArr
                }

            }

            allMembersWithSubs.push(memberObj);

        }
    });

    return (allMembersWithSubs);
}

const createSubscription = async function (input, memberID) {

    let respFromSubscriptionWS;

    try {
        // Get all subscriptions from web service database
        respFromSubscriptionWS = await axios.get(subscriptionsWS_url, {
            headers: { 'x-access-token': CurrentUser.getSubscriptionsWSToken() }
        });
    }
    catch (err) {
        console.log("getting all subscriptions from movies ws is failed!");
        console.log(err);
    }

    let memberSubscriptions = respFromSubscriptionWS.data.find(s => s.MemberID === memberID);


    if (memberSubscriptions) { // Update member subscription movies
        let status;

        let subscriptionObj = {          // Create subscription obj with all inputted data
            MemberID: memberSubscriptions.MemberID,
            Movies: memberSubscriptions.Movies
        }


        subscriptionObj.Movies.push({ movieID: input.movie, date: input.date });


        try {
            // Send data to my web service and insert to database
            status = await axios.put(subscriptionsWS_url + "/" + memberSubscriptions._id, { MemberID: subscriptionObj.MemberID, Movies: subscriptionObj.Movies }, {
                headers: { 'x-access-token': CurrentUser.getSubscriptionsWSToken() }
            });

        }
        catch (err) {
            console.log("Update subscription in WS is failed!");
            console.log(err);
        }


        return status;
    }
    else { // First member subscription - create new 
        let status;

        let subscriptionObj = {          // create subscription obj with all inputted data
            MemberID: memberID,
            Movies: [{ movieID: input.movie, date: input.date }]
        }


        try {
            // Send data to my web service and insert to database
            status = await axios.post(subscriptionsWS_url, { MemberID: subscriptionObj.MemberID, Movies: subscriptionObj.Movies }, {
                headers: { 'x-access-token': CurrentUser.getSubscriptionsWSToken() }
            });

        }
        catch (err) {
            console.log("Create subscription in WS is failed!");
            console.log(err);
        }

        return status;
    }
}

const deleteMember = async function (memberID) {

    let status
    let allSubscriptionsArr;

    try {
        // Delete member from WS by id 
        status = await axios.delete(membersWS_url + '/' + memberID, {
            headers: { 'x-access-token': CurrentUser.getSubscriptionsWSToken() }
        });

        // Get all subscriptions
        allSubscriptionsArr = await axios.get(subscriptionsWS_url, {
            headers: { 'x-access-token': CurrentUser.getSubscriptionsWSToken() }
        });
    }
    catch (err) {
        console.log(err);
    }

    // Delete member and THAN delete his subscriptions
    let subscription = allSubscriptionsArr.data.find(s => s.MemberID === memberID);

    try {
        status = await axios.delete(subscriptionsWS_url + '/' + subscription._id, {
            headers: { 'x-access-token': CurrentUser.getSubscriptionsWSToken() }
        });
    }
    catch (err) {
        console.log(err);
    }

    return status;
}

const addMember = async function (input) {

    let respFromMembersWS;

    try {
        respFromMembersWS = await getAllMembersIncludeSubscriptions(); // Get all members from web service database(check if member already exists)
    }
    catch (err) {
        console.log("get member from movies ws is failed!");
        console.log(err);
    }

    let member = respFromMembersWS.find(member => member.Email === input.Email); // Check if member already exists

    if (!member) { // if is new member
        let status;

        try {
            status = await axios.post(membersWS_url, { Name: input.Name, Email: input.Email, City: input.City }, {
                headers: { 'x-access-token': CurrentUser.getSubscriptionsWSToken() }
            });
        }
        catch (err) {
            console.log("Add new Member to movies ws is failed!");
            console.log(err);
        }


        return status;

    }
    else {
        console.log("Member is already exists")
        return ("Member is already exists");
    }

}

const updateMember = async function (memberData) {
    let status;

    try {
        status = await axios.put(membersWS_url + "/" + memberData.id, { Name: memberData.Name, Email: memberData.Email, City: memberData.City }, {
            headers: { 'x-access-token': CurrentUser.getSubscriptionsWSToken() }
        });
    }
    catch (err) {
        console.log("Update member to movies WS is failed!");
        console.log(err);
    }


    return status;
}


export default { getAllMembersIncludeSubscriptions: getAllMembersIncludeSubscriptions, createSubscription, addMember, deleteMember, updateMember }