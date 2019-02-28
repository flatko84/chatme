var socket = io.connect('http://localhost:3000');

document.getElementById('send').addEventListener('click', function() {
    
    socket.emit('chat', {
        message: document.getElementById('message').value,
        nick: document.getElementById('nick').value
    });
    document.getElementById('message').value = '';
});

socket.on('chat', (chat) => {
    document.getElementById('chat-window').innerHTML += '<br>' + chat.nick + ': ' + chat.message;
});