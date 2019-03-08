var socket = require("socket.io");
var ios = require("socket.io-express-session");
var expSess = require("./session.js");
var ev = require("./events.js");

function ChatServer(server) {

  //open a socket
  var io = socket(server);
  let rooms = {};
  io.use(ios(expSess));
  io.on("connection", socket => {
    console.log("Socket N:" + socket.id);

    socket.on('getRooms', () => {
    io.to(`${socket.id}`).emit('rooms', Object.keys(rooms));
    })
    //on joining room - to do - sanitize input room name - not blank and allowed characters
    socket.on("join", roomName => {
      //if logged
      if (socket.handshake.session.hasOwnProperty("passport")) {

        //if room doesn't exist
        if (!rooms.hasOwnProperty(roomName)) {
          rooms[roomName] = {};
          
        }

        //emit and save rooms
        io.sockets.emit('rooms', Object.keys(rooms));
        rooms[roomName][socket.handshake.session.passport.user.username] =
          socket.handshake.session.passport.user.username;
      
      socket.join(roomName);
      //send users list to all users
      io.sockets.in(roomName).emit("users", {users: rooms[roomName], room: roomName});
    }
    });

    //on leaving room
    socket.on("leave", (roomName) => {
       //if logged
       if (socket.handshake.session.hasOwnProperty("passport") && roomName !== 'undefined') {
         //delete user from room and delete the room if empty
         delete rooms[roomName][socket.handshake.session.passport.user.username];
         if (Object.keys(rooms[roomName]).length === 0){
          delete rooms[roomName];
         };
         //send rooms and users list to coresponding peers
      io.sockets.in(roomName).emit("users", {users: rooms[roomName], room: roomName});
      io.sockets.emit('rooms', Object.keys(rooms));
       }
    });

    //on chat message
    socket.on("chat", chat => {
      //if logged
      if (socket.handshake.session.hasOwnProperty("passport")) {

        //send message to the chat room
        io.sockets.in(chat.roomName).emit("chat", {
          user: socket.handshake.session.passport.user.username,
          message: chat.message,
          room: chat.roomName
        });
      }
    });
  });
}

module.exports = ChatServer;


/* NOTES
-to do - check if you can emit to channel(room) without joining to it and prevent if possible
*/