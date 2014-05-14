var engine;
(function (engine) {

    var core = (function () {

        function core() {
            this.globals = {
                canvas: null,
                context: null,
                imageObjBackground: new Image(),
                imageRock: new Image(),
                imageBonus: new Image(),

                // background value's
                backgroundVelocity: 0,
                backGroundX: 840,
                backGroundY: 440,

                Damage_MAX: 420,
                Hit_Value: 35,

                // value's for the bonus
                frameCounter: 0,
                bonusArr: [],

                // value's for rotate the rock's
                TO_RADIANS: Math.PI / 180,

                explosionArray: [],
                rocksArr: [],
                shipTransform: [],

                scorePlayer2: 0,
                scorePlayer1: 0,
                player1Ship: null,
                player2Ship: null,
                CountdownTimer: 2,
                IsGameStarted: false,
                isReadyToExit: false,
                isHelmsLocked: false,
                userId: null,
                roomId: null,
                FPS: 1000 / 60,
                backGroundSpeed: 2,
                onScreenText: ""
            };
            this.hub = {};
        }


        return core;

    }());

    core.prototype.initPlayers = function () {
        this.globals.player1Ship = new engine.ship('player', 200, 430, 120, 120);
        this.globals.player1Ship.image.src = 'Images/spaceship1.png';

        // Player 2
        this.globals.player2Ship = new engine.ship('wingman', 700, 430, 60, 60);
        this.globals.player2Ship.image.src = 'Images/spaceship2.png';
    };

    core.prototype.initAnimations = function () {
        var i, j, k;
        for (i = 0; i < 7 * 5; i++) {
            this.globals.explosionArray[i] = {
                image: new Image()
            };

            this.globals.explosionArray[i].image.src = "Images/Frames/e" + (j + 1) + ".png";
            if (i % 5 === 0) {
                j++;
            }
        }

        for (i = 0; i < 35; i++) {
            this.globals.shipTransform[i] = {
                image: new Image()
            };

            this.globals.shipTransform[i].image.src = "Images/New ship/tmp-" + k + ".gif";
            if (i % 1 === 0) {
                k++;
            }
        }
    };

    core.prototype.initHubConnection = function () {
        var qs = "roomId=" + this.globals.roomId + "&userId=" + this.hasOwnProperty.userId;
        $.connection.hub.qs = qs;
        this.hub = $.connection.spaceHub;

        $.connection.hub.start().done(function () {
            // $.connection.hub.logging = true;
        });

    };

    core.prototype.gameloop = function (draw, update) {
        this.globals.frameCounter++;
        if (!this.globals.IsGameStarted) {
            if (this.globals.frameCounter % 60 == 0 && this.globals.frameCounter < 420) {
                draw.drawTimer(CountdownTimer);
                this.globals.CountdownTimer--;
                if (this.globals.CountdownTimer <= 0) {
                    this.globals.IsGameStarted = true;
                }
            }
        } else {
            this.globals.scorePlayer1++;
            this.globals.scorePlayer2++;
            draw.drawBackround();
            draw.drawScores();
            draw.drawRocks();
            draw.drawBonus();
            draw.drawLifeBar(core.globals.player1Ship.damageBar, 1);
            draw.drawLifeBar(core.globals.player2Ship.damageBar, 2);
            draw.drawPlayer(core.globals.player1Ship);
            draw.drawPlayer(core.globals.player2Ship);
            update.checkColision();
            update.updateBonusEffect(core.globals.player1Ship);
            update.updateBonusEffect(core.globals.player2Ship);
            draw.drawText(onScreenText);
        }
        requestAnimFrame(gameLoop);
    };

    core.prototype.startEngine = function (draw, update) {
        this.globals.imageRock.src = "Images/asteroid.png";
        this.globals.imageObjBackground.src = "Images/space_background.jpg";
        this.globals.imageBonus.src = "Images/bonus1.png";

        this.globals.canvas = document.getElementById('myCanvas');
        this.globals.context = this.globals.canvas.getContext('2d');
        this.initPlayers();
        this.initAnimations();
        this.initHubConnection();
        this.gameloop(draw, update);
    };



    engine.core = core;

}(engine || (engine = {})));
