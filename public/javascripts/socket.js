var roomName = document.getElementById('room-name').value;
var socket = io.connect('http://localhost:3000/');

window.onunload = () => {
    socket.emit('leave', roomName);
}

document.getElementById('send').addEventListener('click', function() {
    
    socket.emit('chat', {
        message: document.getElementById('message').value,
        roomName: document.getElementById('room-name').value
    });
    document.getElementById('message').value = '';
});

socket.on('connect', () => {
    socket.emit('join', roomName);
});
socket.on('users', users => {
    document.getElementById('users').innerHTML = '';
    var usernames = Object.keys(users.users);
    for (i=0;i<usernames.length;i++){
    document.getElementById('users').innerHTML += usernames[i] + "<br>";
    }
 
});

socket.on('chat', (chat) => {

    document.getElementById('chat-window').innerHTML += '<br>' + chat.user + ': ' + chat.message;
});

socket.on('rooms', rooms => {
    document.getElementById('rooms').innerHTML = '';
    for (i=0;i<rooms.length;i++){
       document.getElementById('rooms').innerHTML += rooms[i] + "<br>";
        }
})


