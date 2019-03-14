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

    //if user is logged in
    if (socket.handshake.session.hasOwnProperty("passport")) {
      User.findOne({
        where: { username: socket.handshake.session.passport.user.username }
      }).then(user => {

        //change status to Online and send to all rooms user has joined
        user.update({ socket_id: socket.id, online: 1 });
        user.getRooms().then(rooms => {
          for (let i = 0; i < rooms.length; i++) {
            socket.in(rooms[i].name).emit("userStatus", {username: user.username, status: 1});
          }
        });
        //change status to Offline and send to all rooms user has joined
        socket.on("disconnect", function() {
          user.update({ online: 0 });
          user.getRooms().then(rooms => {
            for (let i = 0; i < rooms.length; i++) {
              socket.in(rooms[i].name).emit("userStatus", {username: user.username, status: 0});
            }
          });
        });
        //send rooms and joined rooms list on loading page
        socket.on("getRooms", () => {
          Room.findAll({where: {open: 1}})
            .then(rooms => {
              user.getRooms({where: {open: 0}}).then( closedRooms => {
                result = rooms.concat(closedRooms);
              io.to(`${socket.id}`).emit("rooms", result.map(a => a.name));
              });
            })
            .then(
              user.getRooms().then(rooms => {
                io.to(`${socket.id}`).emit("joined", rooms.map(a => a.name));
              })
            );
        });

        //on joining room - to do - sanitize input room name - not blank and allowed characters
        socket.on("join", roomName => {
          //create room if not present
          Room.findOrCreate({
            where: { name: roomName },
            defaults: { open: 1 }
          }).spread((room, created) => {
            if (created){
            io.of("/").emit("roomAdded", roomName);
            }
            //add user to room
            user.addRoom(room).then(() => {
              room.getUsers().then(users => {
                //join socket to room
                socket.join(roomName);
                //notify all in the room for new user
                io.sockets.in(roomName).emit("users", {
                  users: users,
                  room: roomName
                });
              });
            });
          });
        });

        //on leaving room
        socket.on("leave", roomName => {
          //get the room
          Room.findOne({ where: { name: roomName } }).then(room => {
            //remove user from room
            user.removeRoom(room).then(() => {
              //leave room from socket
              socket.leave(roomName);
              room.getUsers().then( users => {
              //delete room if no users are left or if a single person is in a private chat
              if (users.length == 0 || (users.length <= 1 && room.open == 0)) {
                room.destroy();
                io.of("/").emit("roomRemoved", roomName);
              }
              //send users list to room users
            })
            //notify all in the room that the user left, no need to query DB again for complete user list
              io.sockets.in(roomName).emit("userLeft", {
                user: user,
                room: roomName
              });
            });
          });
        });

        //private message as a closed room
        socket.on("pm", targetName => {
          if (user.username != targetName){
          let roomName = "pm-" + user.username + "-" + targetName;
          //create private room if not present, Open is 0
          User.findOne({ where: { username: targetName } }).then(target => {
          Room.findOrCreate({
            where: { name: roomName },
            defaults: { open: 0 }
          }).spread((room, created) => {
            if (created){
            //add users to private room
            user.addRoom(room).then( () => {
              target.addRoom(room).then( () => {
                
                io.to(`${socket.id}`).emit("pm", roomName);
                io.to(`${target.socket_id}`).emit("pm", roomName);
              
                room.getUsers().then(users => {
                  //join socket to room
                  socket.join(roomName);

                  //send users list to room users
                  io.sockets.in(roomName).emit("users", {
                    users: users,
                    room: roomName
                  });
                });
              })
              });
            }
          });
        })
        }
      })

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
