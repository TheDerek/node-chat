var socket = io();

var $input = $('#m');
var $messages = $('#messages');
var $users = $('#users');

$('form').submit(function() {
    if(/\S/.test($input.val()))
    {
        socket.emit('chatMessage', $input.val());
        $input.val('');
    }
    return false;
});

socket.on('chatMessage', function(msg) {
    $messages.append($('<li>').text(msg));
});

socket.on('announcement', function(msg) {
    $messages.append('<li><b>' + msg + '</b></li>');
});

socket.on('newUser', function(user) {
    $users.append('<li id="user-' + user.id + '">' + user.id + '</li>');
});

socket.on('removeUser', function(user) {
    $('#user-' + user.id).remove()
});

socket.on('newUsers', function(users) {
    for (var id in users) {
        if (users.hasOwnProperty(id)) {
            var user = users[id];
            $users.append('<li id="user-' + user.id + '">' + user.id + '</li>');
        }
    }
});