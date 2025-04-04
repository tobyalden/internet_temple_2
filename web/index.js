var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var getJSON = require('get-json')
var { generateUsername } = require("unique-username-generator");

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

app.use(express.static('public'));

app.get('/', function(_, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/styles.css', function(_, res) {
    res.sendFile(__dirname + '/styles.css');
});

io.on('connection', function(socket) {
    socket.on('request current info', function() {
        socket.emit(
            'send current info',
            {'newUsername': generateUsername("_") }
        );
    });

    socket.on('request current stream status', function() {
        getJSON('https://stream.radio2.life/status-json.xsl')
        .then(function(data) {
            if("source" in data.icestats) {
                var title = "";
                if("title" in data.icestats.source) {
                    title = data.icestats.source.title;
                }
                socket.emit(
                    'send current stream status',
                    {'isStreaming': true , 'streamTitle': title }
                );
            }
            else {
                socket.emit(
                    'send current stream status',
                    {'isStreaming': false , 'streamTitle': '' }
                );
            }
        }).catch(function(error) {
            socket.emit(
                'send current stream status',
                {'isStreaming': false , 'streamTitle': '' }
            );
        });
    });

    socket.on('send chat message', function(message) {
        io.emit('get chat message', message);
    });
});

var port = process.env.PORT || 3003;
http.listen(port, function() {
    console.log('listening on *:3003');
});
