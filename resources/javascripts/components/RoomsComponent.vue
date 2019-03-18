<template>
  <div>
    <a href="/account/logout">Logout</a>
    <table id="rooms-table">
      <tr>
        <td id="rooms-col">
          <room-component
            v-show="join == sel"
            v-for="join in joined"
            v-bind:key="join"
            :roomname="join"
          ></room-component>
        </td>
        <td>
          <div v-for="room in rooms" v-bind:key="room">
            <a v-bind:class="{bld: room == sel}" @click="selectRoom(room)">{{ room }}</a>
            <input v-if="joined.includes(room)" type="button" value="X" @click="leaveRoom(room)">
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
    roomAdded: function(room) {
      if (!this.rooms.includes(room.roomName)){
      this.rooms.push(room.roomName);
      }
    },
    roomRemoved: function(roomName) {
      let index = this.rooms.findIndex(node => node == roomName);
      this.rooms.splice(index,1);
    },
    roomJoined: function(roomName) {
      if (!this.rooms.includes(roomName)){
      this.rooms.push(roomName);}
      if (!this.joined.includes(roomName)) {
      this.joined.push(roomName);
      }
      this.sel = roomName;
    },
    pm: function(roomName) {
      this.rooms.push(roomName);
      this.joined.push(roomName);
    }
  },
  methods: {
    newRoom() {
      this.$socket.emit("create", {roomName: this.createRoomName, token: '', open: 1});
      this.createRoomName = "";
    },
    selectRoom(roomName){
      if (!this.joined.includes(roomName)) {
      this.joined.push(roomName);
      };
      this.sel = roomName;
    },
    leaveRoom(roomname) {
      this.$socket.emit("leave", roomname);
      let idx = this.joined.indexOf(roomname);
      this.joined.splice(idx, 1);
    }
  },
  created() {
    this.$socket.emit("getRooms");
  }
};
</script>