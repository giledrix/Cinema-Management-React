import usersBL from "../BL/usersBL";

const saveCurrentUserData = (userData) => {
    sessionStorage.setItem('currentUser', JSON.stringify(userData)); // save all user data in session storage
}

const getName = () => {
    if (sessionStorage.currentUser) {
        return JSON.parse(sessionStorage.currentUser).user.name;
    }
}

const getUserID = () => {
    if (sessionStorage.currentUser) {
        return JSON.parse(sessionStorage.currentUser).user.id;
    }
}

const getUsername = () => {
    if (sessionStorage.currentUser) {
        return JSON.parse(sessionStorage.currentUser).user.username;
    }
}

const getPassword = () => {
    if (sessionStorage.currentUser) {
        return JSON.parse(sessionStorage.currentUser).user.password;
    }
}

const getPermissions = () => {
    if (sessionStorage.currentUser) {
        return JSON.parse(sessionStorage.currentUser).user.permissions;
    }
}

const getPermission =  (permission) => {
    if (sessionStorage.currentUser) {
         let sessionStorageData = JSON.parse(sessionStorage.currentUser)
         return sessionStorageData.user.permissions.includes(permission);
    }
    else{
        return false;
    }
}

const getClassification = () => {
    if (sessionStorage.currentUser) {
        return JSON.parse(sessionStorage.currentUser).user.classification;
    }
}

const getCinemaWSToken = () => {
    if (sessionStorage.currentUser) {
        return JSON.parse(sessionStorage.currentUser).user.tokenCinemaWS;
    }
}

const getSubscribtionsWSToken = () => {
    if (sessionStorage.currentUser) {
        return JSON.parse(sessionStorage.currentUser).user.tokenSubscriptionWS;
    }
}

const getSessionTimeout = () => {
    if (sessionStorage.currentUser) {
        return JSON.parse(sessionStorage.currentUser).user.timeOut;
    }
}



export default { saveCurrentUserData, getName, getUserID, getUsername, getPassword, getClassification, getCinemaWSToken, getSubscribtionsWSToken, getSessionTimeout, getPermissions, getPermission }