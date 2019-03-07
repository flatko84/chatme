<template>
<div>
    <table id="main-space">
        <tr><td>
    <div id="feed">
<div v-for="message in messages" v-bind:key="message">{{ message.user }}: {{ message.message }}</div>

</div>
    <input type="text" v-model="newMessage"><input type="button" @click="sendMessage" value="Send"></td><td>
<div v-for="user in users" v-bind:key="user">{{ user }}</div></td></tr>
    </table>

</div>
</template>

<script>
module.exports = {
    props: ['roomname'],
    data() {
        return {
            users: [],
            messages: [],
            newMessage: ''
        }
    },
    sockets: {
        users: function (usr) {
            this.users = usr;
        },
        chat: function (chat) {
            this.messages.push(chat);
        }
    },
    methods: {
        sendMessage() {
            this.$socket.emit('chat', {roomName: this.roomname, message: this.newMessage});
            this.newMessage = '';
        }
    },
    created(){
        this.$socket.emit('join', this.roomname);
    }
}
</script>