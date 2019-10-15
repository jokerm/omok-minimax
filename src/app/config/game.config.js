var Game;
(function(Game) {
    'use strict';

    var Constants = {
        P1: 1,
        P2: 2,
        ROWS: 19,
        COLS: 19,
        LTW: 5,
        TIE: -1,
        Dificult: {
            Easy: 3,
            Medium: 4,
            Hard: 5
        }
    };

    Game.Config = Constants;

})(Game || (Game = {}));