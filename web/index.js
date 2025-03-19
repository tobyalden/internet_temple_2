var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var { generateUsername } = require("unique-username-generator");

app.use(express.static('public'));

app.get('/', function(_, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/styles.css', function(_, res) {
    res.sendFile(__dirname + '/styles.css');
});

//app.get('/about', function(req, res) {
  //res.sendFile(__dirname + '/about.html');
//});

io.on('connection', function(socket) {
    socket.on('request current info', function() {
        socket.emit(
            'send current info',
            {'newUsername': generateUsername("_") }
        );
    });
    socket.on('send chat message', function(message) {
        io.emit('get chat message', message);
    });
});

var port = process.env.PORT || 3000;
http.listen(port, function() {
    console.log('listening on *:3000');
});
