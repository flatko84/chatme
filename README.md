# chatme
Test Node / Socket.IO project.
Simple chat app written in Node.JS.

The authentication system is written using Passport.JS + MySQL (Sequelize).
Chat's nickname is fetched from Passport session's username.
Users can create rooms, the server keeps track of all rooms and users in a variable and sends events to frontend when something changes.
When a room is left with no users, it's automatically deleted.

Frontend - Vue.JS. Rooms are listed in RoomsComponent, click to join, X to leave, curently selected room in bold.
RoomComponent contains the actual chat window.

Still not implemented - Private messages, SQL records for storing rooms and users on logout / Node restart, maybe storing chat history in SQL.
