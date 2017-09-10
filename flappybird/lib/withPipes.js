function withPipes(state) {
    var preload = state.preload,
        create = state.create;

    state.preload = function() {
        preload.call(state);  
        
        game.load.image('pipe', 'assets/pipe.png');
        game.load.image('pipe-top', 'assets/pipe-top.png');
        game.load.image('pipe-bottom', 'assets/pipe-bottom.png');
    }

    state.create = function() {
        create.call(state);

        this.pipes = game.add.group();
    }

    state.createPipe = function () {        
         // Kies een willekeurige positie om het gat te beginnen
         var holeStart = Math.floor(Math.random() * (game.height - 300)) + 60;
         var holeEnd = holeStart + 180;
 
         this.addPipePart('pipe', 0, holeStart);
         this.addPipePart('pipe', holeEnd, game.height - holeEnd);
         
         this.addPipePart('pipe-top', holeStart - 40, 1);
         this.addPipePart('pipe-bottom', holeEnd, 1);
    },

    state.addPipePart = function (name, posY, size) {
        // Maak de pipe aan
        var pipe = game.add.sprite(game.width, posY, name);
        this.pipes.add(pipe);

        // Stel 'physics' in op de pipe zodat we deze een snelheid kunnen geven
        game.physics.arcade.enable(pipe);

        // Stel de snelheid waarmee de buis naar links beweegt
        pipe.body.velocity.x = -200;

        // Zorg ervoor dat de pipe opgeruimd wordt wanneer deze buiten het scherm komt
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;

        pipe.scale.y = size;
    }
}
