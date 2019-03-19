var socket = require("socket.io");
var ios = require("socket.io-express-session");
var expSess = require("./session.js");
var crypto = require("crypto");
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
            socket
              .in(rooms[i].name)
              .emit("userStatus", { username: user.username, status: 1 });
          }
        });
        //change status to Offline and send to all rooms user has joined
        socket.on("disconnect", function() {
          user.update({ online: 0 });
          user.getRooms().then(rooms => {
            for (let i = 0; i < rooms.length; i++) {
              socket
                .in(rooms[i].name)
                .emit("userStatus", { username: user.username, status: 0 });
            }
          });
        });
        //send rooms and joined rooms list on loading page
        socket.on("getRooms", () => {
          Room.findAll({ where: { open: 1 } })
            .then(openRooms => {
              user.getRooms({ where: { open: 0 } }).then(closedRooms => {
                rooms = openRooms.concat(closedRooms);
                io.to(`${socket.id}`).emit("rooms", rooms);
              });
            })
            .then(
              user.getRooms().then(jnRooms => {
                io.to(`${socket.id}`).emit("joined", jnRooms);
              })
            );
        });

        //create room and return event on success
        socket.on("create", crRoom => {
          Room.findOrCreate({
            where: { name: crRoom.roomName },
            defaults: {
              open: crRoom.open,
              token: ""
            }
          }).spread((room, created) => {
            if (created) {
              
              io.to(`${socket.id}`).emit("roomJoined", room);
              if (room.open == 1){
              io.of("/").emit("roomAdded", room);
              }
            }
          });
        });

        //join room
        socket.on("join", jnRoom => {
          Room.findOne({where: { name: jnRoom.roomName }}).then(room => {
            if (room.open == 1 || jnRoom.token == room.token){
            //add user to room
            user.addRoom(room).then(() => {
              room.getUsers({attributes: ['username', 'online']}).then(users => {
                //join socket to room
                socket.join(room.name);
                //notify all in the room for new user
                io.sockets.in(room.name).emit("users", {
                  users: users,
                  room: room.name
                });
              });
            });
          }
          });
        });

        //leave room
        socket.on("leave", roomName => {
          //get the room
          Room.findOne({ where: { name: roomName } }).then(room => {
            //remove user from room
            user
              .removeRoom(room)
              .then(
                //leave room from socket
                socket.leave(roomName)
              )
              .then(
                room.getUsers().then(users => {
                  //delete room if no users are left or if a single person is in a private chat
                  if (
                    users.length == 0 ||
                    (users.length <= 1 && room.open == 0)
                  ) {
                    room.destroy();
                    io.of("/").emit("roomRemoved", room);
                  }
                  //send users list to room users
                })
              )
              .then(
                //notify all in the room that the user left, no need to query DB again for complete user list
                io.sockets.in(roomName).emit("userLeft", {
                  user: user,
                  room: roomName
                })
              );
          });
        });

        //private message as a closed room
        socket.on("pm", targetName => {
          if (user.username != targetName) {
            
            User.findOne({where: {username: targetName}}).then(target => {
              Room.create({name: "PM-"+socket.id, open: 0, token: 'jkhkjhkjh'}).then(room => {
                
                io.to(`${socket.id}`).emit("roomAdded", room);
                io.to(`${target.socket_id}`).emit("roomAdded", room);
                io.to(`${socket.id}`).emit("roomJoined", room);
                io.to(`${target.socket_id}`).emit("roomJoined", room);
              })
            })
          }
        });

        //on chat message
        socket.on("chat", chat => {
          //send message to the chat room
          io.sockets.in(chat.roomName).emit("chat", {
            user: user.username,
            message: chat.message,
            roomName: chat.roomName
          });
        });
      });
    }
  });
}

module.exports = ChatServer;
