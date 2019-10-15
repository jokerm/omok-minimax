(function(Game) {	
	Game.Game4Line = function () {
        this.gameOver = false;
        this.actualPlayer = Game.PLAYER1;
        this.board = new Game.BOARD.Board();
        var _this = this;
        
        this.restart = function() {
            this.gameOver = false;
            this.actualPlayer = Game.PLAYER1;
            this.board = new Game.BOARD.Board();            
        }
        
        this.play = function(j) {
            if(this.gameOver == false) {
                var rA = this.board.getRowAvailable(j);
                if(rA >=0) {
                    this.board.set(rA,j,this.actualPlayer);
                    this.gameOver = this.board.isGameOver();
                    if(this.gameOver > 0) {
                        console.log("Game Over - Player {0} wins".format(this.actualPlayer))
                    } else if(this.gameOver == -1) {
                        console.log("Game Over it is a TIE");
                    } else {
                        changePlayer();
                        console.log("Player {0} is your turn".format(this.actualPlayer));
                    }
                    console.log(this.board.toString());
                } else {
                    console.log("The column {0} is full, try another".format(j));                
                }
            } else {
                console.log("Please insert another coin :P");
            }
        }
        
        var changePlayer = function() {
            _this.actualPlayer = (_this.actualPlayer == Game.PLAYER1)?Game.PLAYER2:Game.PLAYER1;
        }
        
    }
})(window.Game || (window.Game = {}));