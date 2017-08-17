var state = {
    preload: function () {
        game.load.spritesheet('bird', 'assets/bird.png', 68, 48, 3);

        game.load.image('background', 'assets/background.png');

        game.load.image('pipe', 'assets/pipe.png');
        game.load.image('pipe-top', 'assets/pipe-top.png');
        game.load.image('pipe-bottom', 'assets/pipe-bottom.png');

        game.load.audio('flap', 'assets/flap.mp3');
        game.load.audio('hit', 'assets/hit.mp3');
    },

    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Achtergrond
        this.background = game.add.sprite(0, 0, 'background');
        this.background.width = game.width;
        this.background.height = game.height;

        // Scorefs
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", {
            font: "30px Arial",
            fill: "#ffffff"
        });

        // Voeg de vogel toe
        this.bird = game.add.sprite(100, 245, 'bird');
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000;
        this.bird.checkWorldBounds = true;
        this.bird.events.onOutOfBounds.add(this.restart, this);

        // Spatiebalk voert de functie 'flap' uit 
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.flap, this);   
        game.input.onTap.add(this.flap, this);

        // Voer iedere 2 seconde de functie 'addPipes' uit
        this.pipes = game.add.group();
        this.timer = game.time.events.loop(3000, this.addPipes, this);

        // Geluiden initialiseren
        this.flapSound = game.add.audio('flap');
        this.hitSound = game.add.audio('hit');
    },

    update: function () {
        game.physics.arcade.overlap(this.bird, this.pipes, this.restart, null, this);
    },

    restart: function () {
        this.hitSound.play();
        game.state.start('main');
    },

    flap: function () {
        // Laat de vogel omhoog vliegen
        this.bird.body.velocity.y = -350;

        // Voer de 'fly' animatie uit
        this.bird.animations.add('fly');
        this.bird.animations.play('fly', 10, false);

        // Start het 'flap' geluid
        this.flapSound.play();
    },

    addPipes: function () {        
        // Kies een willekeurige positie om het gat te beginnen
        var holeStart = Math.floor(Math.random() * (game.height - 300)) + 60;
        var holeEnd = holeStart + 180;

        this.addPipe('pipe', 0, holeStart);
        this.addPipe('pipe', holeEnd, game.height - holeEnd);
        
        this.addPipe('pipe-top', holeStart - 40, 1);
        this.addPipe('pipe-bottom', holeEnd, 1);

        // Verhoog de score met 1 en werk de tekst van het score-label bij
        this.score += 1;
        this.labelScore.text = this.score;
    },

    addPipe: function (name, posY, size) {
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

var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS);
game.state.add('main', state);
game.state.start('main');
