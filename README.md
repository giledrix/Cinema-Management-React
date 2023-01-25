# Movies & Subscriptions Management Web Application - Front (React.js)





This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## System Architecture

![2](https://user-images.githubusercontent.com/41838762/214542500-ae643b80-284c-44ad-b7a7-f46088482225.png)

## Data Sources Structures:

<ins>Users.json</ins><br/>
A json file stores the system users data. Each user has an ID , name , created date , session timeout

<ins>Permissions.json</ins><br/>
A json file stores the users permissions. Each record (user) has a user id and array of permissions.


<ins>UsersDB</ins><br/>
A MongoDB database who stores :<br/>
     _id (ObjectId)<br/>
    Username (String)<br/>
    Password ( String)<br/>
    Classification (String)<br/>

<ins>SubscriptionsDB</ins><br/>
A MongoDB database holds 3 collections :
1. Members – A collection that stores the subscription members data pulled from the
Members WS at https://jsonplaceholder.typicode.com/users :

    _id (ObjectId)<br/>
    Name (String)<br/>
    Email (String)<br/>
    City (String)<br/>
    
2. Movies – A collection that stores movies data pulled from the Movies WS as
https://api.tvmaze.com/shows

     _id (ObjectId)
     Name (String)<br/>
     Genres ( Array of Strings) <br/>
     Image ( A string – The url of the image picture)<br/>
     Premiered (Date)<br/>
     
     
3.Subscriptions – A collection stores the data of all the subscriptions:<br/>

      _id (ObjectId)<br/>
      MemberId (ObjectId)<br/>
      Movies ( an Array of { movieId : Object Id, date : Date} ) - This field store all the movies
      the member (subscription) watched and their dates<br/>

## System Components:

<ins>Subscriptions WS : </ins><br/>
This is a Node based REST api that provide services/data about members (subscriptions), movies and the
movies the members watched.<br/>
When the REST API server starts, it pulled all the data from the external members & movies web services
and populated the relevant data in the relevant collections (Members & Movies collections) in the
Subscriptions DB ( a MongoDB data base).<br/>
At this point, the Subscriptions collection is empty (as none of the members has not watched any movie
yet).<br/>
<b>From this point, all the data will be managed in the Subscriptions DB !!!</b><br/>



<ins>Cinema WS : </ins><br/>
This is a Node based REST API that provides a management system for movies and subscriptions.<br/>
System users<br/>
Only authorized users can log in to the web site.<br/>
The first user is the Admin and only he can manage other users (create, change & remove)<br/>

The Users.json stores the following data for every user:<br/>

   Id (The _id that created in the Data Base)<br/>
   First Name <br/>
   Last Name<br/>
   Created date<br/>
   SessionTimeOut ( number) – the duration (in minutes) a user can work on the system
   once he logged in.
   
   
The Permissions.json stores all the user permissions regarding the movies management system:<br/>

  Id (The _id that created in the Data Base)<br/>
  Permissions - an array of permissions (strings)<br/>
      “View Subscriptions”<br/>
      “Create Subscriptions”<br/>
      “Delete Subscriptions”<br/>
      “View Movies”<br/>
      “Create Movies”<br/>
      “Delete Movies”<br/>
<b>A user can have many permissions !</b><br/>


The User DB database stored a collection with the following data:<br/>
   _Id (ObjectId)<br/>
   UserName ( Required for login)<br/>
   Password ( Required for login)<br/>
   
<b>The system starts with only one (pre-defined) record of the
System Admin data (both in the json files and in the data base)</b>

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
