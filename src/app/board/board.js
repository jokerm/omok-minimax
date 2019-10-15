var Game;
(function (nms) {
    'use strict';
    var K_P1 = Game.Config.P1; //Player 1 indentifier
    var K_P2 = Game.Config.P2; //Player 2 identifier
    var K_R = Game.Config.ROWS; //Rows number
    var K_C = Game.Config.COLS; //Columns number
    var K_DEP = Game.Config.LTW;  //Lines to win

    /**
     * Represets Table Game
     * @class Board
     */
    function Board(board) {
        var _this = this;
        var _board = board || new Uint8Array(K_R * K_C); //Craete 2d array board ->*prealocated array has better performance

        /// Bind functions
        this.get = get;
        this.set = set;
        this.equals = equals;
        this.getRowAvailable = getRowAvailable;
        this.outLimit = outLimit;
        this.isGameOver = isGameOver;
        this.restart = restart;
        this.toString = toString;
        this.canThrow = canThrow;

        /**
         * Get value at position
         * @param  {number} i row position
         * @param  {number} j col positon
         */
        function get(i, j) {
            return _board[i * K_C + j];
        }

        /**
         * Set value at position
         * @param  {number} i row position
         * @param  {number} j col position
         * @param  {number} val Value
         */
        function set(i, j, val) {
            return _board[i * K_C + j] = val;
        }

        /**
         * Checks if a value is equals at position i,j
         * @param  {number} i row position
         * @param  {number} j col position
         * @param  {number} val Value
         */
        function equals(i, j, val) {
            return _board[i * K_C + j] === val;
        }

        function canThrow(i, j) {
            return _board[i * K_C + j] === 0;
        }

        /**
         * Checks if some player wins filling places to win
         * @param {number} i - Row position
         * @param {number} j - Col position
         * @return {number} numero Who won else if no one
         */
        function hasCollide (i, j) {
            var val = _this.get(i, j);
            return val ? isColliding(i, j, -1, -1, 1, val) || isColliding(i, j, 1, 0, 1, val) ||
                isColliding(i, j, 0, -1, 1, val) || isColliding(i, j, -1, 1, 1, val) ||
                isColliding(i, j, 1, -1, 1, val) || isColliding(i, j, 0, 1, 1, val) ||
                isColliding(i, j, -1, 0, 1, val) || isColliding(i, j, 1, 1, 1, val) : false;
        }

        /**
         * Given a direction this function determine if all the pieces are equals until places to win
         * @param  {number} i Row position
         * @param  {number} j Col position
         * @param  {number} di Horizontal direction (+,-)
         * @param  {number} dj Vertical direction (+,-)
         * @param  {number} dep Current deep
         * @param  {number} val Piece value
         */
        function isColliding(i, j, di, dj, dep, val) {
            if (_this.outLimit(i, j)) return false;
            if (_this.get(i, j) === val) {
                if (dep == K_DEP) return val;
                return isColliding(i + di, j + dj, di, dj, dep + 1, val);
            }
            return false;
        }

        /**
         * This checks if there is space in the specified column
         * @param  {number} j Column
         */
        function getRowAvailable(j) {
            var i = 0;
            while (i < K_R && _this.get(i, j) != K_P1 && _this.get(i, j) != K_P2) i++;
            return i - 1;
        }

        /**
         * Out of bounds validation
         * @param  {number} i row number
         * @param  {number} j col number
         */
        function outLimit(i, j) {
            return i < 0 || j < 0 || i >= K_R || j >= K_C;
        }

        /**
         * Checks if the game has finished
         */
        function isGameOver() {
            var who;
            var isTie = 0;
            for (var i = 0; i < K_R; i++) {
                for (var j = 0; j < K_C; j++) {
                    if (_this.get(i, j)) isTie++;
                    if ((who = hasCollide(i, j))) {
                        return who;
                    }
                }
            }
            if (isTie == K_R * K_C) return -1;
            return false;
        }

        function restart() {
            _movesHistory = [];
            _stack = 0;
            _board = _board.map(function() { return 0;});
        }

        function toString() {
            var out = "/*" + "-".repeat(K_C) + "Board status" + "-".repeat(K_C) + "*/\n";
            for (var i = 0; i < K_R; i++) {
                for (var j = 0; j < K_C; j++) {
                    out += "[{0}]".format(_this.get(i, j) || 0);
                }
                out += "\n";
            }
            out += "/*" + "-".repeat(K_C) + "End of Board" + "-".repeat(K_C) + "*/\n"
            return out;
        }
    }

    nms.Board = Board;
})(Game || (Game = {}));