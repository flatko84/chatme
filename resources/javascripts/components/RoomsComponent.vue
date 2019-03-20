<template>
  <div>
    <a href="/account/logout">Logout</a>
    <table id="rooms-table">
      <tr>
        <td id="rooms-col">
          <room-component
            v-show="join.room_id == sel"
            v-for="join in joined"
            v-bind:key="join.room_id"
            :roomid="join.room_id"
            :roomname="join.name"
            :token="join.token"
          ></room-component>
        </td>
        <td>
          <div v-for="room in rooms" v-bind:key="room.room_id">
            <a v-bind:class="{bld: room.room_id == sel}" @click="selectRoom(room)">{{ room.name }}</a>
            <input v-if="joined.findIndex(node => node.room_id == room.room_id) != -1" type="button" value="X" @click="leaveRoom(room)">
            <br>
          </div>
          <br>Name:
          <input type="text" v-model="createRoomName">
          <input type="button" value="New" @click="newRoom">
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
module.exports = {
  //rooms = all rooms, joined = all joined rooms by the user, sel = room currently selected for chat
  data() {
    return {
      rooms: [],
      joined: [],
      sel: "",
      createRoomName: ""
    };
  },
  sockets: {
    rooms: function(rooms) {
      this.rooms = rooms;
    },
    joined: function(rooms) {
      this.joined = rooms;
      if (rooms.length > 0){
      this.sel = rooms[0].room_id;
      }
    },
    roomAdded: function(room) {
      if (this.rooms.findIndex(node => node.room_id == room.room_id) == -1){
      this.rooms.push(room);
      }
    },
    roomRemoved: function(room) {
      let index = this.rooms.findIndex(node => node.room_id == room.room_id);
      if (index !== 'undefined'){
      this.rooms.splice(index,1);
      }
    },
    roomJoined: function(room) {
      if (this.rooms.findIndex(node => node.room_id == room.room_id) == -1){
      this.rooms.push(room);}
      if (this.joined.findIndex(node => node.room_id == room.room_id) == -1) {
      this.joined.push(room);
      }
      this.sel = room.room_id;
    },
    pm: function(roomName) {
      this.rooms.push(roomName);
      this.joined.push(roomName);
    }
  },
  methods: {
    newRoom() {
      this.$socket.emit("create", {roomName: this.createRoomName, open: 1});
      this.createRoomName = "";
    },
    selectRoom(room){
   if (this.joined.findIndex(node => node.room_id == room.room_id) == -1) {
      this.joined.push(room);
      }
      this.sel = room.room_id;
    },
    leaveRoom(room) {
      this.$socket.emit("leave", room.name);
      let idx = this.joined.findIndex(node => node.room_id == room.room_id)
      this.joined.splice(idx, 1);
    }
  },
  created() {
    this.$socket.emit("getRooms");
  }
};
</script>