# chatme
Test Node / Socket.IO project.
Simple chat app written in Node.JS.

The authentication system is written using Passport.JS + MySQL (Sequelize).
Chat's nickname is fetched from Passport session's username.
Users can create rooms, the server keeps track of all rooms and users in a variable and sends events to frontend when something changes.
When a room is left with no users, it's automatically deleted.

Frontend - Vue.JS. Rooms are listed in RoomsComponent, click to join, X to leave, curently selected room in bold.
RoomComponent contains the actual chat window.

New: Status shown to other users in joined rooms
PM - generating as a separate room with open=false. To do - naming private rooms, hiding from rooms list based on open=false.

Still not implemented - Validate / sanitize input - room names and messages, Change password page, Refactoring as separate functions or as a class.
