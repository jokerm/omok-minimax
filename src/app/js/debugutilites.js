/*--- Player 1 Wins --*/
var instance = new Game.Game4Line();
var cpu = new Game.CPU(Game.PLAYER1, Game.PLAYER2, 6);
var DBG = {
    winP1: function(){
        instance.restart();
        instance.play(0)
        instance.play(0)
        instance.play(0)
        instance.play(0)
        instance.play(0)
        instance.play(0)
        instance.play(0)
        instance.play(0)
        instance.play(1)
        instance.play(2)
        instance.play(1)
        instance.play(2)
        instance.play(1)
        instance.play(2)
        instance.play(1)
        instance.play(2)
        instance.play(1)
        instance.play(2)
    },
    winP2: function() {
        instance.restart();
        instance.play(0)
        instance.play(0)
        instance.play(0)
        instance.play(0)
        instance.play(0)
        instance.play(0)
        instance.play(0)
        instance.play(0)
        instance.play(1)
        instance.play(2)
        instance.play(3)
        instance.play(2)
        instance.play(1)
        instance.play(2)
        instance.play(3)
        instance.play(2)
        instance.play(3)
        instance.play(2)        
    },
    setTie: function() {
        instance.restart();
        for(var i=0; i<7;i++) {
            for(var j=0;j<7;j++) {
                instance.play(i);
            }
        }
    },
    insertImage: function() {
        var img = document.createElement('img');
        img.src = 'http://pngimg.com/upload/football_PNG1082.png';
        img.width = 100;
        img.height = 100;
        img.id = 'myImg';
        document.getElementById('scenario').appendChild(img);
        
    }
}