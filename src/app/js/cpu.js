(function(Game) {	
	Game.CPU = function(me, human, level) {
        var K_MAX_POINT = 10000;
        var K_MIN_POINT = -10000;
        this.me = me;
        this.human = human;
        this.level = level;
        
        /**
         * This method gets CPU play
         * @param {Board} board Game instance.
         */
        this.playAsync = function(board) {
            var _this = this;
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    var move = _this.miniMax(board);
                    console.log(move);
                    resolve(move);
                }, true);
            });
        }
        
        /**
         * This method gets CPU play
         * @param {Board} board Game instance.
         */
        this.play = function(board) {
            return this.miniMax(board);
        }        
        
        this.clonar = function(board) {
            var nB = new Game.BOARD.Board();
            for(var i=0;i < Game.BOARD.R; i++) {
                for(var j=0; j  <Game.BOARD.C; j++) {
                    nB.set(i,j, board.get(i,j));
                }
            }
            return nB;
        }
        
        this.max = function(a,b) {
            return a>b?a:b;
        }
        
        this.min = function(a,b) {
            return a<b?a:b;
        }
        
        /**
         * Algoritmo MiniMax
         * {param} Object - Tablero del juego
         * {return} Columna con mejor posibilidad de ganar
         */
        this.miniMax = function(board) {
            var mejor_mov = -1;
            var max, max_actual;
            max = -Math.pow(2,32);
            for(var j=0; j < Game.BOARD.C; j++) {
                var rA = board.getRowAvailable(j);
                if(rA >=0) {                        //Check if row is available
                    board.set(rA, j, this.me);      //Set CPU play
                    max_actual = this.valorMin(board, 0, -Math.pow(2,32), Number.MAX_VALUE);
                    board.set(rA, j, 0);            //Restore play
                    if(max_actual > max) {          //Get best move
                        max = max_actual;
                        mejor_mov = j;
                    }
                }
            }
            return mejor_mov;
        }
        
        this.valorMax = function(board, prof, alfa, beta) {
            if(board.isGameOver() || prof > this.level) return this.heuristica(board);
            for(var j=0; j < Game.BOARD.C; j++) {
                var rA = board.getRowAvailable(j);
                if(rA >=0) {
                    board.set(rA, j, this.me);
                    alfa = this.max(alfa, this.valorMin(board, prof + 1, alfa, beta));
                    board.set(rA, j, 0);            //Restore board's stage
                    if(alfa >= beta) return beta;
                }
            }
            return alfa;
        }
        
        this.valorMin = function(board, prof, alfa, beta) {
            if(board.isGameOver() || prof > this.level) return this.heuristica(board);
            for(var j=0; j < Game.BOARD.C; j++) {
                var rA = board.getRowAvailable(j);
                if(rA >=0) {
                    board.set(rA, j, this.human);
                    beta = this.min(beta, this.valorMax(board, prof + 1, alfa, beta));
                    board.set(rA, j, 0);            //Restore board's stage
                    if(alfa >= beta) return alfa;
                }
            }
            return beta;
        }
        
        this.isAllowed = function(i, j) {
            return !(i < 0 || j < 0 || i >= Game.BOARD.R || j >= Game.BOARD.C)
        }
        
        /**
         * Función heurística
         * {param} Object - Tablero
         * {return} costo de la tirada
         */
        this.heuristica = function(board) {
            var costo = 0;
            var gmovr = board.isGameOver();            
            if(gmovr == this.me) return K_MAX_POINT;
            if(gmovr == this.human) return K_MIN_POINT;
            
            costo = this.costoU(this.clonar(board), this.human, this.me);
            costo = this.costoU(this.clonar(board), this.me, this.human) - costo;
            
            return costo;
        }        
        
        /**
         * Costo unitario, determina cuanas lineas tiene el jugador(plyr) para ganar
         * @param {Object} Tablero del juego
         * @param {plyr} Identificador del jugador
         * @param {vs} Identificador del contrincante
         * @return {number} No de lineas en las que puede ganar el jugador
         */
        this.costoU = function(board, plyr, vs) {
            var k = 0, nivel, j;
            for(var i=Game.BOARD.R-1; i>=0; i--) {
                for(j=0, nivel=0; j<Game.BOARD.C; j++) {
                    if(board.get(i,j) == 0) nivel++;
                    if(board.get(i,j) == plyr) {
                        board.set(i,j,3);
                        
                        if((this.isAllowed(i-3,j) && this.isAllowed(i-2,j) && this.isAllowed(i-1,j))
                            &&(board.get(i-3,j)!=vs && board.get(i-2,j)!=vs && board.get(i-1,j)!=vs)
                                &&(board.get(i-3,j)!=3 && board.get(i-2,j)!=3 && board.get(i-1,j)!=3))
                                    k++;		
                        
                        if((this.isAllowed(i+3,j) && this.isAllowed(i+2,j) && this.isAllowed(i+1,j))            
                            &&(board.get(i+3,j)!=vs && board.get(i+2,j)!=vs && board.get(i+1,j)!=vs)
                                &&(board.get(i+3,j)!=3 && board.get(i+2,j)!=3 && board.get(i+1,j)!=3))
                                    k++;						

                        if((this.isAllowed(i,j-3) && this.isAllowed(i,j-2) && this.isAllowed(i,j-1))
                            &&(board.get(i,j-3)!=vs && board.get(i,j-2)!=vs && board.get(i,j-1)!=vs)
                                &&(board.get(i,j-3)!=3 && board.get(i,j-2)!=3 && board.get(i,j-1)!=3))
                                    k++;						

                        if((this.isAllowed(i,j+3) && this.isAllowed(i,j+2) && this.isAllowed(i,j+1))
                            &&(board.get(i,j+3)!=vs && board.get(i,j+2)!=vs && board.get(i,j+1)!=vs)
                                &&(board.get(i,j+3)!=3 && board.get(i,j+2)!=3 && board.get(i,j+1)!=3))
                                    k++;		
                                    				
                        if((this.isAllowed(i-3,j-3) && this.isAllowed(i-2,j-2) && this.isAllowed(i-1,j-1))
                            &&(board.get(i-3,j-3)!=vs && board.get(i-2,j-2)!=vs && board.get(i-1,j-1)!=vs)
                                &&(board.get(i-3,j-3)!=3 && board.get(i-2,j-2)!=3 && board.get(i-1,j-1)!=3))
                                    k++;						

                        if((this.isAllowed(i+3,j+3) && this.isAllowed(i+2,j+2) && this.isAllowed(i+1,j+1))
                            &&(board.get(i+3,j+3)!=vs && board.get(i+2,j+2)!=vs && board.get(i+1,j+1)!=vs)
                                &&(board.get(i+3,j+3)!=3 && board.get(i+2,j+2)!=3 && board.get(i+1,j+1)!=3))
                                    k++;						

                        if((this.isAllowed(i+3,j-3) && this.isAllowed(i+2,j-2) && this.isAllowed(i+1,j-1))
                            &&(board.get(i+3,j-3)!=vs && board.get(i+2,j-2)!=vs && board.get(i+1,j-1)!=vs)
                                &&(board.get(i+3,j-3)!=3 && board.get(i+2,j-2)!=3 && board.get(i+1,j-1)!=3))
                                    k++;						

                        if((this.isAllowed(i-3,j+3) && this.isAllowed(i-2,j+2) && this.isAllowed(i-1,j+1))
                            &&(board.get(i-3,j+3)!=vs && board.get(i-2,j+2)!=vs && board.get(i-1,j+1)!=vs)
                                &&(board.get(i-3,j+3)!=3 && board.get(i-2,j+2)!=3 && board.get(i-1,j+1)!=3))
                                    k++;						                        
                    }
                }
                if(nivel >= Game.BOARD.C - 1) return k;
            }
            return k;
        }
    }
})(window.Game || (window.Game = {}));