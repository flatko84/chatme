var socket = require("socket.io");
var ios = require("socket.io-express-session");
var expSess = require("./session.js");
var ev = require("./events.js");
var Room = require("./model/room.js");
var User = require("./model/user.js");
var UserRoom = require("./model/userroom.js");
Room.belongsToMany(User, { through: UserRoom, foreignKey: "room_id" });
User.belongsToMany(Room, { through: UserRoom, foreignKey: "user_id" });

function ChatServer(server) {
  //open a socket
  var io = socket(server);
  io.use(ios(expSess));

  io.on("connection", socket => {
    console.log("Socket N:" + socket.id);
    if (socket.handshake.session.hasOwnProperty("passport")) {
      User.findOne({
        where: { username: socket.handshake.session.passport.user.username }
      }).then(user => {
        //send rooms list on loading page
        socket.on("getRooms", () => {
          Room.findAll().then(rooms => {
            let roomnames = [];
            for (let i = 0; i < rooms.length; i++) {
              roomnames.push(rooms[i].name);
            }
            io.to(`${socket.id}`).emit("rooms", roomnames);
          });
        });
        //on joining room - to do - sanitize input room name - not blank and allowed characters
        socket.on("join", roomName => {
          //if room doesn't exist
          Room.findOrCreate({ where: { name: roomName } }).spread(
            (room, created) => {
              user.addRoom(room).then(() => {
                room.getUsers().then(users => {
                  //join room
                  socket.join(roomName);
                  //send users list to all users
                  let usernames = [];
                  for (let i = 0; i < users.length; i++) {
                    usernames.push(users[i].username);
                  }
                  io.sockets
                    .in(roomName)
                    .emit("users", { users: usernames, room: roomName });

                  //emit and save rooms
                  Room.findAll().then(rooms => {
                    let roomnames = [];
                    for (let i = 0; i < rooms.length; i++) {
                      roomnames.push(rooms[i].name);
                    }
                    io.to(`${socket.id}`).emit("rooms", roomnames);
                  });
                });
              });
            }
          );
        });
        //on leaving room
        socket.on("leave", roomName => {
        Room.findOne({ where: { name: roomName } }).then( room => {
            user.removeRoom(room).then(() => {
              room.getUsers().then(users => {
                if (users.length == 0){
                  room.destroy();
                }
                //join room
                socket.join(roomName);
                //send users list to all users
                let usernames = [];
                for (let i = 0; i < users.length; i++) {
                  usernames.push(users[i].username);
                }
                io.sockets
                  .in(roomName)
                  .emit("users", { users: usernames, room: roomName });

                //emit and save rooms
                Room.findAll().then(rooms => {
                  let roomnames = [];
                  for (let i = 0; i < rooms.length; i++) {
                    roomnames.push(rooms[i].name);
                  }
                  io.to(`${socket.id}`).emit("rooms", roomnames);
                });
              });
            });
          
        });
      });

        //on chat message
        socket.on("chat", chat => {
          //send message to the chat room
          io.sockets.in(chat.roomName).emit("chat", {
            user: user.username,
            message: chat.message,
            room: chat.roomName
          });
        });
      });
    }
  });
}

module.exports = ChatServer;
