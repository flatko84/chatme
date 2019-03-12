<template>
  <div>
    <table class="chatroom">
      <tr>
        <td>
          <div id="feed">
            <div
              v-for="message in messages"
              v-bind:key="message"
            >{{ message.user }}: {{ message.message }}</div>
          </div>
          <form id="message-bar" @submit.prevent="sendMessage">
            <input type="text" v-model="newMessage">
            <input type="submit" value="Send">
          </form>
        </td>
        <td>
          <div v-for="user in users" v-bind:key="user">{{ user }}</div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
module.exports = {
    //users = all users in the room, messages = all messages sent to the room, newMessage = message field
  props: ["roomname"],
  data() {
    return {
      users: [],
      messages: [],
      newMessage: ""
    };
  },
  sockets: {
    users: function(usr) {
      if (usr.room == this.roomname) {
        this.users = usr.users;
      }
    },
    chat: function(chat) {
      if (chat.room == this.roomname) {
        this.messages.push({ user: chat.user, message: chat.message });
      }
    }
  },
  methods: {
    sendMessage() {
      this.$socket.emit("chat", {
        roomName: this.roomname,
        message: this.newMessage
      });
      this.newMessage = "";
    }
  },
  created() {
    this.$socket.emit("join", this.roomname);
  }
};
</script>