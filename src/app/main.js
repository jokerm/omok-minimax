var app = {
    loader: {},
    init: function () {
        app.loader.require({
            board: 'app/board/board.js',
            engine: 'app/core/game.engine.js',
            cpu: 'app/ai/ai.js',
            socketIo: 'utils/socket.io.js'
        }, app.startGame);
    },
    bindEvents: function () {

    },
    recivedEvents: function () {

    },
    startGame: function () {
        console.log('/*-- App is ready --*/');
        if (ROBIN) { //If console log is open (debug mode) load utilities for debug
            app.loader.require({
                debugutilities: 'app/js/debugutilites.js'
            });
        }
    },
    doLogin: function () {
        var http = new XMLHttpRequest();
        var url = "http://105.102.48.44:8080/login";
        var params = "user=limacoa&pass=samex1103";
        http.open("POST", url, true);

        //Send the proper header information along with the request
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        http.onreadystatechange = function () { //Call a function when the state changes.
            if (http.readyState == 4 && http.status == 200) {
                app.User = JSON.parse(http.responseText);
                app.connect();
            }
        }
        http.send(params);
    },
    connect: function () {
        var ia = new Game.AI(Game.Config.P1, Game.Config.P2, 2);
        app.socket = io.connect("http://105.102.48.44:8080/", {
            query: 'token=' + app.User.access_token
        });
        app.socket.on("error", function (error) {
            console.error(error);
        });
        app.socket.on('connect', function() {
            console.log('conected');            
        });
        app.socket.on('room:all', function(rooms) {
            console.log(rooms);
            app.socket.emit("room/join", rooms[0]);
        });
        app.socket.on('room:joined', function(data) {
            console.log(data);
        });
        app.socket.on('game:training:code', function(code) {
            console.log(code);
        });
        app.socket.on('room:play:result', function(data) {
            console.log(data);
            if(data.currentPlayer == "limacoa") {
                ia.me = data.players[0].UserName == "limacoa" ? Game.Config.P1: Game.Config.P2;
                ia.human = ia.me == Game.Config.P1?Game.Config.P2:Game.Config.P1;
                var board = new Game.Board(data.board);
                var move = ia.play(board);
                console.log("Play --> ", move);
                app.socket.emit("room/play", {i:move[0], j:move[1]});
            }
        });
    },
    training: function() {
        app.socket.emit("game/training/request");
    },
    botFight: function() {
        app.socket.emit("room/all");
    }
};
var ROBIN = false; //debug mode, comment to release
app.loader = new LoaderJS('0.0.1');
app.loader.load(['app/config/global.config.js', 'app/config/game.config.js'], app.init);