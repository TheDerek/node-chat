var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var shortid = require('shortid');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendfile('index.html');
});

var users = {};

io.on('connection', function(socket) {
    // Generate and id for the user and notify various parties that there is
    // a new user
    var user = createUser(socket);
    console.log('User \'' + user.id + '\' has connected.');
    io.emit('announcement', 'User \'' + user.id + '\' has connected.');
    io.emit('newUser', user);

    // Inform the user of users already connected to the server
    socket.emit('newUsers', users);

    // Add the user to our list of users
    users[user.id] = user;

    socket.on('disconnect', function() {
        // Locate the disconnected user
        var user = users[socket.id];

        // Inform clients that the user has disconnected
        console.log('User \'' + user.id + '\' has left.');
        io.emit('announcement', 'User \'' + user.id + '\' has left.');
        io.emit('removeUser', user);

        // Remove the user
        delete users[user.id];
    });

    socket.on('chatMessage', function(msg) {
        var user = users[socket.id];
        console.log(user.id + ': ' + msg);
        io.emit('chatMessage', user.id + ': ' + msg);
    });

});

http.listen(3000, function() {
    console.log('listening on *:3000');
});

function createUser(socket)
{
    var user = {id: shortid.generate(), joinTime: Date.now()};
    socket.id = user.id;
    return user;
}