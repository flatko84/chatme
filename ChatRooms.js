

function ChatRooms() {
  ev.on("getRooms", message => {
    ev.emit("rooms", rooms.keys());
  });

  ev.on("getUsers", message => {
    ev.emit("users", rooms[message.room].keys());
  });

  ev.on("joinRoom", message => {
    console.log(rooms);
  });

  ev.on("leaveRoom", message => {
    delete rooms[message.room][message.user];
    let roomUsers = rooms[message.room].keys();
    if (roomUsers.length == 0) {
      delete rooms[message.room];
    }
  });
}
module.exports = ChatRooms;
