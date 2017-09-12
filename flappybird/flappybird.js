var state = {
    preload: function () {
        // Assets inladen
        game.load.image('background', 'assets/background.png');        
        game.load.spritesheet('bird', 'assets/bird.png', 68, 48, 3);
        game.load.audio('flap', 'assets/flap.mp3');
        game.load.audio('hit', 'assets/hit.mp3');
    },

    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Achtergrond
        this.background = game.add.sprite(0, 0, 'background');
        this.background.width = game.width;
        this.background.height = game.height;

        // Vogel
        this.bird = game.add.sprite(100, 245, 'bird');
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000;
        this.bird.animations.add('fly');
        this.bird.checkWorldBounds = true;
        this.bird.events.onOutOfBounds.add(this.hit, this);

        // Spatiebalk roept de functie 'flap' aan
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.flap, this);  

        // Punten op 0 zetten en het label aanmaken
        this.points = 0;
        this.labelPoints = game.add.text(20, 20, "0", {
            font: "30px Arial",
            fill: "#ffffff"
        });        

        // Maak iedere 3 seconden een nieuwe buis aan
        this.timer = game.time.events.loop(3000, this.createPipe, this);

        // Verhoog iedere seconde de score
        this.timer = game.time.events.loop(1000, this.score, this);

        // Geluiden aan het spel toevoegen
        this.flapSound = game.add.audio('flap');
        this.hitSound = game.add.audio('hit');
    },

    update: function () {
        // Als de vogel een buis raakt, wordt de functie 'hit' uitgevoerd
        game.physics.arcade.overlap(this.bird, this.pipes, this.hit, null, this);
    },

    flap: function() {
        this.bird.body.velocity.y = -350;
        this.bird.animations.play('fly', 10, false);
        this.flapSound.play();
    },

    hit: function() {
        this.hitSound.play();
        game.state.start('main');
    },

    score: function() {
        this.points += 1;
        this.labelPoints.text = this.points;
    }
}

withPipes(state);

var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS);
game.state.add('main', state);
game.state.start('main');
