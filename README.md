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

### Front End : 

The Front End will be build with React & context api

#### Pages & Procedures


##### 1 – Login Page
The home page of the system. A page with username & password text box and a “Login” button. A
successful log in redirect to “Main” Page. A failed attempt will present a proper message in the same
page (Login page).
Once a user logged in – his name will be presented in all the site pages
First time users (which don’t have password yet) will click on “create account” link which will redirect
them to a “CretaeAccount” page

![‏‏צילום מסך (12)](https://user-images.githubusercontent.com/41838762/214557359-89f4b031-4b02-4f2b-91ed-a395fa7a8ca0.png)

