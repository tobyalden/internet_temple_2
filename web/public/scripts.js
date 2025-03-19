$(function() {
    var socket = io();
    console.log("Welcome to INTERNET TEMPLE 2...")

    var username = localStorage.getItem('internet-temple-2-username');
    socket.emit("request current info");

    socket.on("send current info", function(currentInfo) {
        console.log("...please enjoy your stay.");
        if(username === null) {
            username = currentInfo.newUsername;
            localStorage.setItem('internet-temple-2-username', username);
        }
    });

    socket.on("get chat message", function(message) {
        $("#chat-log").val($("#chat-log").val() + "\n" + message);
        $('#chat-log').scrollTop($('#chat-log')[0].scrollHeight);
    });

    $(document).keypress(function(e) {
        if(e.which == 13) {
            sendChatMessage();
        }
    });

    $("#chat-send").click(function(e) {
        sendChatMessage();
    });

    function sendChatMessage() {
        message = $("#chat-input").val().trim();
        if(message.length == 0) {
            return;
        }
        if(message.startsWith('/name')) {
            var oldUsername = username;
            username = message.split('/name')[1].substring(0, 30).trim();
            localStorage.setItem('internet-temple-2-username', username);
            socket.emit("send chat message", oldUsername + " changed names to " + username + ".");
        }
        else {
            socket.emit("send chat message", username + ": " + message);
        }
        $("#chat-input").val("");
    }

    function updateStreamStatus() {
        console.log("updating stream status");
        $.getJSON("http://localhost:8000/status-json.xsl", function(data) {
            if("source" in data.icestats) {
                console.log("stream running");
                setSteamStatus(true);
            }
            else {
                console.log("stream not running");
                setSteamStatus(false);
            }
        }).fail(function () {
            console.log("stream not running");
            setSteamStatus(false);
        });
    }

    function setSteamStatus(isOnline) {
        if(!isOnline) {
            pauseAudio();
        }
        $("#player-controls-online").attr("hidden", !isOnline);
        $("#player-controls-offline").attr("hidden", isOnline);
    }

    $('#player-controls-online').click(function() {
        var audio = $("#player-audio")[0];
        if(audio.duration > 0 && !audio.paused) {
            pauseAudio();
        }
        else {
            playAudio();
        }
    });

    function pauseAudio() {
        var audio = $("#player-audio")[0];
        audio.pause();
        $("#player-play").attr("hidden", false);
        $("#player-pause").attr("hidden", true);
    }

    function playAudio() {
        var audio = $("#player-audio")[0];
        audio.play();
        $("#player-play").attr("hidden", true);
        $("#player-pause").attr("hidden", false);
    }

    updateStreamStatus();
    setInterval(function() {
        updateStreamStatus();
    }, 5000);
});

