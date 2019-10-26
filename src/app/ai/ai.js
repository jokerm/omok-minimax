var Game;
(function (Game) {
    'use strict';
    /**
     * Artificial Intelligence class that implements minimax algorithm to play in a omok/gomoku board
     * @author Robin Gonzalez <robinmg1@hotmail.com>
     * @param {flag cpu player} me 
     * @param {flag for human player} human 
     * @param {depth level of search} level 
     */
    function AI(me, human, level) {
        var _this = this;
        var K_MAX_POINT = 10000;
        var K_MIN_POINT = -10000;
        var K_WILD_P = 3; //Wild player for heuristic purpose

        this.me = me;
        this.human = human;
        this.level = level;
        this.play = play;
        this.unitCost = unitCost;
        this.humanMoves = null;
        this.meMoves = null;
        this.playAsync = playAsync;
        ///

        /**
         * This method gets CPU play async
         * @param {Board} board Game instance.
         */
        function playAsync(board) {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve(MiniMax(board));
                }, true);
            });
        }

        /**
         * This method gets CPU play sync
         * @param {Board} board Game instance.
         */
        function play(board) {
            return MiniMax(board);
        }

        /**
         * Gets value using offset in a vector
         * @param {number} i 
         * @param {number} j 
         */
        function getId(i, j) {
            return i * Game.Config.COLS + j;
        }

        /**
         * This function builds array nodes where can be played in the board
         * @param {Game.Board} board 
         */
        function getGameNodes(board) {
            var nodes = new Array(Game.Config.COLS * Game.Config.ROWS);
            for (var i = 0; i < Game.Config.ROWS; i++) {
                for (var j = 0; j < Game.Config.COLS; j++) {
                    if (board.canThrow(i, j) == false) {
                        setAdycentNodes(i, j, board, nodes);
                    }
                }
            }
            return nodes;
        }

        /**
         * Build a vector where can be played
         * @param {number} i 
         * @param {number} j 
         * @param {Game.Board} board 
         * @param {Array} nodes 
         */
        function setAdycentNodes(i, j, board, nodes) {
            board.canThrow(i - 1, j - 1) && (nodes[(i - 1) * Game.Config.COLS + (j - 1)] = [i - 1, j - 1]);
            board.canThrow(i - 1, j) && (nodes[(i - 1) * Game.Config.COLS + j] = [i - 1, j]);
            board.canThrow(i - 1, j + 1) && (nodes[(i - 1) * Game.Config.COLS + (j + 1)] = [i - 1, j + 1]);
            board.canThrow(i, j - 1) && (nodes[i * Game.Config.COLS + (j - 1)] = [i, j - 1]);
            board.canThrow(i, j + 1) && (nodes[i * Game.Config.COLS + (j + 1)] = [i, j + 1]);
            board.canThrow(i + 1, j - 1) && (nodes[(i + 1) * Game.Config.COLS + (j - 1)] = [i + 1, j - 1]);
            board.canThrow(i + 1, j) && (nodes[(i + 1) * Game.Config.COLS + j] = [i + 1, j]);
            board.canThrow(i + 1, j + 1) && (nodes[(i + 1) * Game.Config.COLS + (j + 1)] = [i + 1, j + 1]);
            return nodes;
        }

        function MiniMax(board) {
            _this.humanMoves = new Array(Game.Config.ROWS * Game.Config.COLS).fill(0);
            _this.meMoves = new Array(Game.Config.ROWS * Game.Config.COLS).fill(0);
            var bestMove = [parseInt(Game.Config.ROWS / 2), parseInt(Game.Config.COLS / 2)];
            var max = -Number.MAX_SAFE_INTEGER;
            var nodes = getGameNodes(board);
            for (var idx = 0, l = nodes.length; idx < l; idx++) {
                if (nodes[idx]) {
                    var i = nodes[idx][0];
                    var j = nodes[idx][1];
                    board.set(i, j, _this.me); //Try to play

                    _this.meMoves[getId(i, j)] = [i, j];

                    var prediction = minValue(board, 0, -Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
                    board.set(i, j, 0); //Restore play

                    _this.meMoves[getId(i, j)] = 0;

                    if (prediction > max) {
                        max = prediction;
                        bestMove = [i, j];
                    }
                }
            }
            return bestMove;
        }


        function minValue(board, depth, alpha, beta) {
            var isGameOver = board.isGameOver();
            if (depth > _this.level || isGameOver) return heuristic(board, isGameOver);
            var nodes = getGameNodes(board);
            for (var idx = 0, l = nodes.length; idx < l; idx++) {
                if (nodes[idx]) {
                    var i = nodes[idx][0];
                    var j = nodes[idx][1];
                    board.set(i, j, _this.human); //Try to play with human
                    _this.humanMoves[getId(i, j)] = [i, j];
                    beta = Math.min(beta, maxValue(board, depth + 1, alpha, beta));
                    board.set(i, j, 0); //Restore play
                    _this.humanMoves[getId(i, j)] = 0;
                    if (alpha >= beta) return alpha;
                }
            }
            return beta;
        }

        function maxValue(board, depth, alpha, beta) {
            var isGameOver = board.isGameOver();
            if (depth > _this.level || isGameOver) return heuristic(board, isGameOver);
            var nodes = getGameNodes(board);
            for (var idx = 0, l = nodes.length; idx < l; idx++) {
                if (nodes[idx]) {
                    var i = nodes[idx][0];
                    var j = nodes[idx][1];
                    board.set(i, j, _this.me); //Try to play with human
                    _this.meMoves[getId(i, j)] = [i, j];
                    alpha = Math.max(alpha, minValue(board, depth + 1, alpha, beta));
                    board.set(i, j, 0); //Restore play
                    _this.meMoves[getId(i, j)] = 0;
                    if (alpha >= beta) return beta;
                }
            }
            return alpha;
        }

        /**
         * Heuristic function, it tells how bad decision is current play for bot player
         * @param {Game.Board} board 
         * @param {number} gmovr 
         */
        function heuristic(board, gmovr) {
            var cost = 0;
            if (gmovr === _this.me) return K_MAX_POINT;
            if (gmovr === _this.human) return K_MIN_POINT;
            if (gmovr === Game.Config.TIE) return 0;

            cost = unitCost(board, _this.human, _this.me);
            cost = unitCost(board, _this.me, _this.human) - cost;

            return cost;
        }

        /**
         * Given a direction this function determine if a player can conec N pieces
         * @param  {number} i Row position
         * @param  {number} j Col position
         * @param  {number} di Horizontal direction (+,-)
         * @param  {number} dj Vertical direction (+,-)
         * @param  {number} depth Current depth
         * @param  {Game.Board} board Game Board
         * @param  {number} vs rival player
         */
        function canWin(i, j, di, dj, depth, board, vs) {
            if (board.outLimit(i, j)) return depth - 1;
            if (board.get(i, j) != vs && board.get(i, j) != K_WILD_P) {
                if (depth === Game.Config.LTW) return true;
                return canWin(i + di, j + dj, di, dj, depth + 1, board, vs);
            }
            return depth - 1;
        }

        /**
         * Helper function for heuristic, it calcs how many lines are left to win
         * @param {number} i 
         * @param {number} j 
         * @param {Game.Board} board 
         * @param {number} vs 
         */
        function linesToWin(i, j, board, vs) {
            var START = 1;
            var k = 0;
            var tmp = 0; //this tmp value save current pices connected since current postion
            tmp = canWin(i, j, -1, -1, START, board, vs);
            (tmp === true) && (tmp = 1) && k++;
            (canWin(i, j, 1, 1, tmp, board, vs) === true) && k++;

            tmp = canWin(i, j, -1, 0, START, board, vs);
            (tmp === true) && (tmp = 1) && k++;
            (canWin(i, j, 1, 0, tmp, board, vs) === true) && k++;

            tmp = canWin(i, j, 0, -1, START, board, vs);
            (tmp === true) && (tmp = 1) && k++;
            (canWin(i, j, 0, 1, tmp, board, vs) === true) && k++;

            tmp = canWin(i, j, -1, 1, START, board, vs);
            (tmp === true) && (tmp = 1) && k++;
            (canWin(i, j, 1, -1, tmp, board, vs) === true) && k++;

            return k;
        }

        /**
         * Get board game playinf depeding player plays
         * @param {number} plyr - player flag
         */
        function getNodes(plyr) {
            if (plyr === _this.me) {
                return _this.meMoves;
            } else {
                return _this.humanMoves;
            }
        }

        /**
         * Heuristic helper function, it calcs how possible es that current player can wins using lines to win helper
         * @param {Game.Board} board 
         * @param {number} plyr 
         * @param {number} vs 
         */
        function unitCost(board, plyr, vs) {
            var nivel = 0;
            var nodes = getNodes(plyr);
            var k = 0;
            for (var idx = 0, l = nodes.length; idx < l; idx++) {
                if (nodes[idx] != 0) {
                    var node = nodes[idx];
                    var i = node[0];
                    var j = node[1];
                    var winPosible = linesToWin(i, j, board, vs);
                    k += winPosible;
                    (winPosible > 0) && board.set(i, j, K_WILD_P);
                }
            }
            for (var i = 0, l = nodes.length; i < l; i++) {
                if (nodes[i] != 0) {
                    var node = nodes[i];
                    board.set(node[0], node[1], plyr);
                }
            }
            return k;
        }

    }

    Game.AI = AI;
})(Game || (Game = {}));