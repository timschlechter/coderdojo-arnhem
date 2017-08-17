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
        game.add.tileSprite(0, 0, 960, 720, 'background');

        // Score
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
        this.timer = game.time.events.loop(2000, this.addPipes, this);

        // Geluiden initialiseren
        this.flapSound = game.add.audio('flap');
        this.hitSound = game.add.audio('hit');

        //scaling options
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.setScreenSize(true);
        this.scale.forceLandscape = true;
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
        // De sprites van de pipes (buizen) zijn 60 pixel hoog
        // De totale hoogte van de game is 720 pixels
        // We hebben dus 720 / 60 = 12 vakjes om een pipe te plaatsen

        // Kies een willekeurig nummer tussen 1 en 8
        var hole = Math.floor(Math.random() * 8) + 1;

        // Voeg 12 'pipe' onderdelen toe, behalve in de vakjes waar het gat it
        for (var i = 0; i < 13; i++) {
            if (i < hole || i > hole + 3) {
                this.addPipe('pipe', i);
            }
        }

        // Plaats de bovenkant en de onderkant van de buis
        this.addPipe('pipe-top', hole - 1);
        this.addPipe('pipe-bottom', hole + 3);

        // Verhoog de score met 1 en werk de tekst van het score-label bij
        this.score += 1;
        this.labelScore.text = this.score;
    },

    addPipe: function (name, pos) {
        // Maak de pipe aan
        var pipe = game.add.sprite(game.width, pos * 60, name);
        this.pipes.add(pipe);

        // Stel 'physics' in op de pipe zodat we deze een snelheid kunnen geven
        game.physics.arcade.enable(pipe);

        // Stel de snelheid waarmee de buis naar links beweegt
        pipe.body.velocity.x = -200;

        // Zorg ervoor dat de pipe opgeruimd wordt wanneer deze buiten het scherm komt
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    }
}

var game = new Phaser.Game(960, 720);
game.state.add('main', state);
game.state.start('main');
