<template>
  <div>
    <table>
      <tr>
          <td>
          <room-component v-for="join in joined" v-bind:key="join" :roomname="join"></room-component>
        </td>
        <td>
          <div v-for="room in rooms" v-bind:key="room"><a @click="joinRoom(room)">{{ room }}</a><br></div>
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
      this.joined.push(this.createRoomName);
      this.createRoomName = "";
    },
    joinRoom(name) {
        this.joined.push(name);
    }
  }
};
</script>