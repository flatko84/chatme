<template>
  <div>
    <a href="/account/logout">Logout</a>
    <table id="rooms-table">
      <tr>
          <td>
          <room-component v-show="join == sel" v-for="join in joined" v-bind:key="join" :roomname="join"></room-component>
        </td>
        <td>
          <div v-for="room in rooms" v-bind:key="room"><a v-bind:class="{bld: room == sel}" @click="joinRoom(room)">{{ room }}</a><input v-if="joined.includes(room)" type="button" value="X" @click="leaveRoom(room)"><br></div>
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
  data() {
    return {
      rooms: [],
      joined: [],
      sel: '',
      createRoomName: ""
    };
  },
  sockets: {
    rooms: function(rms) {
      this.rooms = rms;
    }
  },
  methods: {
    newRoom() {
      if (!this.joined.includes(this.createRoomName)){
      this.joined.push(this.createRoomName);
      }
      this.sel = this.createRoomName;
      this.createRoomName = "";
    },
    joinRoom(name) {
      if (!this.joined.includes(name)){
        this.joined.push(name);
      }
      this.sel = name;
    },
    leaveRoom(roomname) {
            this.$socket.emit('leave', roomname);
            let idx = this.joined.indexOf(roomname);
            this.joined.splice(idx, 1);
        }
  },
  created(){
    this.$socket.emit('getRooms');
  }
};
</script>