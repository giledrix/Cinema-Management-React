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

### Subscriptions WS : <br/>
This is a Node based REST api that provide services/data about members (subscriptions), movies and the
movies the members watched.<br/>
When the REST API server starts, it pulled all the data from the external members & movies web services
and populated the relevant data in the relevant collections (Members & Movies collections) in the
Subscriptions DB ( a MongoDB data base).<br/>
At this point, the Subscriptions collection is empty (as none of the members has not watched any movie
yet).<br/>
<b>From this point, all the data will be managed in the Subscriptions DB !!!</b><br/>



### >Cinema WS : <br/>
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


##### 2 – CreateAccount Page
This page will allow to a new user (that has been created by the Sys admin) to setup his login details. The
page will present 2 text boxes:
- User Name – the given UserName from the SYS Admin
- Password – a new password

A click on “Create” button will check: If the UserName exists in the data base, it will store the new
password and redirect back to LogIn page.
If the UserName is NOT exist in the data base, the page will present a proper message and the creation
will fail!
![‏‏צילום מסך (13)](https://user-images.githubusercontent.com/41838762/214558024-d02d1cac-fe84-447b-bcaf-4f1574904773.png)

##### 3 – Main Page
The Main page contain a menu of the system movies & subscriptions options
<b>For the Sys Admin ONLY, there will be another Menu option called “Manage Users”</b>
- Movies – Will Redirect to “Movies” Page
- Subscriptions – Will redirect to “Subscriptions” Page
- Users Management – Visible only to the sys Admin – will redirect to “Manage Users” page
- Logout – Will log out the current user and redirect to “Login” Page

![‏‏צילום מסך (14)](https://user-images.githubusercontent.com/41838762/214559384-9bdef17d-470f-4e8f-a885-c3180677f3fd.png)

##### 4 - ManageUsers Page
This page has a menu with 2 options:
- All Users (default) – shows the “Users” page
- Add User- redirect to “Add User” page


##### 5. “All Users” Page
This page presents all the users data :
- Click on “Edit” button will redirect to “Edit User” page
- Click on “Delete” button will delete the user’s and all his data from the system

![‏‏צילום מסך (15)](https://user-images.githubusercontent.com/41838762/214559864-c03130f5-186d-4848-9342-80a9def44cb6.png)

##### 6 - EditUser Page
This page present a form with all the selected user’s data:
- First Name
- Last Name
- Created Date (Read only)
- UserName
- Seesion Time Out
- Permissons : a list of checkboxes will all the permissions types:
• “View Subscriptions”
• “Create Subscriptions”
• “Delete Subscriptions”
• “Update Subscription
• “View Movies”
• “Create Movies”
• “Delete Movies”
• “Update Movie”

A click on “Create Subscriptions” , “Update Subscriptions” and “Delete Subscriptions” options
will automatically check the “View Subscriptions” checkbox

A click on “Create Movies” , “Update Movies” and “Delete Movies” options will automatically
check the “View Movies” checkbox

- A click on “Update” button will be save the updated data and redirect back to “All Users” page
- A click on “Cancel” button will redirect back to “All Users” page


![‏‏צילום מסך (16)](https://user-images.githubusercontent.com/41838762/214560460-b0f16ce7-d81e-4feb-aa41-e374eb25d21b.png)

##### 7 - AddUser Page
This page present a form with all the fields for a new user’s data:
- First Name
- Last Name
- UserName
- Seesion Time Out
- Permissons : a list of checkboxes will all the permissions types:
• “View Subscriptions”
• “Create Subscriptions”
• “Delete Subscriptions”
• “Update Subscription
• “View Movies”
• “Create Movies”
• “Delete Movies”
• “Update Movie”

A click on “Create Subscriptions” , “Update Subscriptions” and “Delete Subscriptions” options
will automatically check the “View Subscriptions” checkbox


A click on “Create Movies” , “Update Movies” and “Delete Movies” options will automatically
check the “View Movies” checkbox

A “save” button will save all the data in the proper data sources : First in the data base for
getting the new _id for the user, and then in the json files (with the given id)

A “cancel” button click will redirect back to the “ManageUsers” page




![‏‏צילום מסך (17)](https://user-images.githubusercontent.com/41838762/214561836-5565cf94-8424-402d-bf68-f11298ae105e.png)



#### Movies & Subscriptions Management
The System allows to manage members (subscriptions) and their movies



##### 8 – Movies Page

This page has a menu with 2 options:
- “All Movies” (default) page
- “Add Movie” page


##### 9 – “All Movies” Page

Present all movies in a list. Each movie has it’s name, year, image, “edit” & “delete” buttons, and a list of
all the subscriptions that watched that movies (name + year)
Each subscription name is a link.
<b>This page is visible only to users with the right permission
This “Edit” & “Delete” buttons are visible only users with the right permission</b>

- A click on “Edit” button will redirect to “Edit Movie” page
- - A click on “Delete” button will delete all the movie’s data from the server, including from the
subscription’s watched movies list
- A click on the Subscriber link will redirect to the “Member” page
- Enter movie name phrase and click on the “Find” button” will present the same page with the
match movies

![‏‏צילום מסך (18)](https://user-images.githubusercontent.com/41838762/214562757-d172f25c-41de-47f3-a958-31b959b9e4dc.png)


##### 10 – “Add Movie” Page
This page allows to create a new movie
<b>This page is visible only to users with the right permission</b>

- A click on “Save” button will save the new data in the DB
- A click on “Cancel” button will redirect to the “All Movies” page


![‏‏צילום מסך (19)](https://user-images.githubusercontent.com/41838762/214562986-01ce8668-3d41-453f-a6f0-7445ec95b759.png)



##### 11 – “Edit Movie” Page
This page allows us to update a movie data
<b>This page is visible only to users with the right permission</b>

- A click on “Update” button will save the updated data in the DB
- A click on “Cancel” button will redirect to the “All Movies” page


![‏‏צילום מסך (20)](https://user-images.githubusercontent.com/41838762/214563212-8d34bac2-a85f-4bcb-a7a1-7d6dff961f80.png)







##### 12 – “Subscriptions” Page: 

This page manages all the members and their movies subscriptions
This page is visible only to users with the right permission
This page has a menu with 2 options:
- All Members (Default) – present “All Memebers” page
- Add Member – present “Add Member” page


##### 13 – “All Members” Page:

This page presents all the members and their movies they watched (subscribed to)
- Click on the “edit” button will redirect to “Edit Member” page
- Click on “Delete” button will delete all the user’s data (including the relevant data from the
movies data sources)


![‏‏צילום מסך (21)](https://user-images.githubusercontent.com/41838762/214563524-47ab8100-2fed-4f18-8649-9b3b31eef672.png)


The “Watched Movies” section includes a list of links to the movies the member watched, and the date
he watched them. Is also have a button for subscribing to a new movie.
- A click on a movie link will redirect to “All Movies” page that present ONLY the selected movie.
- A click on “Subscribe on new movie” button will open a new section with a drop down with all
the movies he <ins>has not watched yet </ins>, and a date for watching it.

- Click in “Subscribe” will add the subscription of that movies (at that date) to the member
- Another click on “Subscribe to new movie” button will close the “add new movie” section


![‏‏צילום מסך (22)](https://user-images.githubusercontent.com/41838762/214563745-09d936bd-049e-46bb-88b0-ae09bda26629.png)

##### 14 – “Edit Member” Page
This page allows us to edit the member’s data

- Click on “Update” button will update the member’s data
- Click on “Delete” button will redirect back to the “All Members” Page


![‏‏צילום מסך (24)](https://user-images.githubusercontent.com/41838762/214563986-2fbd0739-94ce-4e74-bb58-26eec382693f.png)



##### 15 – “Add Member” Page
This page allows us to add a new member
This page is visible only to users with the right permission

- Click on “Save” button will create the new member
- Click on “Delete” button will redirect back to the “All Members” Page


![‏‏צילום מסך (25)](https://user-images.githubusercontent.com/41838762/214564258-88782c27-804d-4ec1-a25e-076f8483fb61.png)




