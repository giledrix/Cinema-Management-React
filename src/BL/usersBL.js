import axios from 'axios'

import CurrentUser from '../Utils/CurrentUser'


const url = "http://localhost:9000/api/users"


const loginValidation = (user) => {
    return axios.post(url, user);
}

const verifyUserToken = () => {
    const userToken = CurrentUser.getSubscriptionsWSToken();

    if (userToken) {
        return axios.get(url + "/tokenverify", {
            headers: { 'x-access-token': userToken }
        });
    }
    else {
        return;
    }

}

const createNewUser = (user) => {
    return axios.post(url + "/reg", user);
}

const adminCreateNewUser = (user) => {

    return axios.post(url + "/adminreg", user, {
        headers: { 'x-access-token': CurrentUser.getCinemaWSToken() }
    });
}

const getAllUsersDataFromAllSources = () => {

    return axios.get(url + "/getAllUserData", {
        headers: { 'x-access-token': CurrentUser.getSubscriptionsWSToken() }
    });
}

const updateUserData = (user) => {

    return axios.post(url + "/updateuser", user, {
        headers: { 'x-access-token': CurrentUser.getCinemaWSToken() }

    });
}

const deleteUser = (userID) => {

    return axios.delete(url + "/deleteuser/" + userID, {
        headers: { 'x-access-token': CurrentUser.getCinemaWSToken() }
    });
}

export default { loginValidation, verifyUserToken, createNewUser, adminCreateNewUser, updateUserData, deleteUser, getAllUsersDataFromAllSources }