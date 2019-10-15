var Game;
(function (Game) {
    'use strict';

    function Engine() {
        var _this = this;
        var _isGameOver = false;
        var _currentPlayer = Game.Config.P1;
        var _board = new Game.Board();

        ///
        this.restart = restart;
        this.makePlay = makePlay;
        this.play = play;
        this.getBoard = getBoard;

        function makePlay(i, j, player) {
            if(_currentPlayer != player) {
                console.log("Is not your turn");
                return;
            }
            if (_board.set(i, j, _currentPlayer)) {
                _currentPlayer = _currentPlayer == Game.Config.P1 ? Game.Config.P2 : Game.Config.P1;
                console.info(_board.toString());
                console.log(i, j);
            } else {
                console.info("Move not valid");
            }
        }

        function play(i, j) {
            if (i instanceof Game.AI) {
                var move = i.play(_board);
                makePlay(move[0], move[1], i.me);
/*                i.playAsync(_board).then(function (ply) {
                    makePlay(ply[0], ply[1], i.me);
                });*/
            } else {
                makePlay(i, j, _currentPlayer);
            }
            console.log(_isGameOver = _board.isGameOver());
            console.log(_currentPlayer);
        }

        function restart() {
            _isGameOver = false;
            _board.restart();
        }

        function getBoard() {
            return _board;
        }
    }

    Game.Engine = Engine;
})(Game || (Game = {}));