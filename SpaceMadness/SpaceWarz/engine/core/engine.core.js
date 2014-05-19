//'use strict';
var engine = {};
engine.models = {};

(function(engine) {

    var core = (function() {

        function Core() {
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
            this.draw = null;
            this.update = null;
            this.ws = {};
        }

        return Core;

    }());

    core.prototype.initPlayers = function() {
        this.globals.player1Ship = new engine.models.ship('player', 200, 430, 60, 60);
        this.globals.player1Ship.image.src = 'Images/spaceship1.png';

        // Player 2
        this.globals.player2Ship = new engine.models.ship('wingman', 700, 430, 60, 60);
        this.globals.player2Ship.image.src = 'Images/spaceship2.png';
    };

    core.prototype.initAnimations = function() {
        var i, j = 0,
            k = 0;
        for (i = 0; i < 7 * 5; i++) {
            this.globals.explosionArray[i] = {
                image: new Image()
            };

            this.globals.explosionArray[i].image.src = "Images/Frames/e" + (j + 1) +
                ".png";
            if (i % 5 === 0) {
                j++;
            }
        }

        for (i = 0; i < 35; i++) {
            this.globals.shipTransform[i] = {
                image: new Image()
            };

            this.globals.shipTransform[i].image.src = "Images/New ship/tmp-" + k +
                ".gif";
            if (i % 1 === 0) {
                k++;
            }
        }
    };

    core.prototype.initServerConnection = function() {
        var qs = "roomId=1" + "&userId=2",
            that = this;

        this.ws = new XSockets.WebSocket('ws://localhost:4502/SpaceMadness');

        this.ws.on(XSockets.Events.open, function(data) {
            console.log('Open', data);

            that.ws.publish("joinGame", {
                userId: 1,
                roomId: 2
            });

        });

        this.ws.on("wingManMove", function(data) {
            if (that.globals.IsGameStarted) {
                that.globals.player2Ship.x = data.x;
                that.globals.player2Ship.y = data.y;
            }
        });

        this.ws.on("wingManExplode", function(data) {
            if (that.globals.IsGameStarted) {
                that.globals.player2Ship.takeHit();
                updateScore(2, "hit");
            }
        });

        that.ws.on("wingmanBump", function() {
            that.globals.player1Ship.fx = new fx.bump(false);
            that.globals.player1Ship.isUnderEffect = true;
            console.log("bumped");
        });

        this.ws.on("addNewRock", function(rock) {
            that.globals.rocksArr[rock.index] = rock;
            console.info(common.utils.timeNow(), rock.index);
        });

        this.ws.on("setRockArray", function(data) {
            that.globals.rocksArr = data;
        });

        this.ws.on("setBonusData", function(data) {
            that.update.updateBonus(data);
            // console.warn(common.utils.timeNow(), data);
        });

        this.ws.on("startGame", function(playerIndex) {
            switch (playerIndex) {
                case 1:
                    // this.globals.player1Ship.image.src = 'Images/spaceship1.png'
                    that.globals.player1Ship.image.src =
                        'Images/New ship/tmp-35.gif';
                    that.globals.player2Ship.image.src = 'Images/spaceship2.png';
                    that.globals.player1Ship.Transform = true;
                    that.globals.player1Ship.frameIndex = 0;

                    break;
                case 2:
                    that.globals.player1Ship.image.src = 'Images/spaceship2.png';
                    that.globals.player2Ship.image.src = 'Images/spaceship1.png';
                    that.globals.player1Ship.x = that.globals.player2Ship.x;
                    that.globals.player1Ship.y = that.globals.player2Ship.y;
                    that.globals.player2Ship.x = that.globals.player1Ship.oldX;
                    that.globals.player2Ship.y = that.globals.player1Ship.oldY;

                    break;

            }
            window.showMessage("Click 'Esc' to exit the room !!!");
            that.globals.backGroundSpeed = 2;
            that.ws.publish("initRockArray");
            that.globals.IsGameStarted = true;
            that.gameloop();
        });

        this.ws.on("playerWait", function(data) {
            showMessage("Wait for another player to arrive ...");
            drawBackround();
            drawScore.cores();
            drawLifeBar(newEngine.core.globals.player1Ship.damageBar, 1);
            drawLifeBar(wingMan.damageBar, 2);
            drawPlayer(newEngine.core.globals.player1Ship);
            drawPlayer(wingMan);
        });

        this.ws.on("redirectToLobby", function(urlTarget, msg) {
            showMessage(msg);
            FPS = 0;
            window.location = urlTarget;
        });

        this.ws.on("wingmanTakesBonus", function(data) {
            bonusArr[data.bonusIndex].timeout = 0;

            var wingman = that.globals.player1Ship;

            switch (data.type) {
                case 0:
                    that.update.updateScore(2, "bonus");
                    break;
                case 1:
                    if (wingMan.fx) {
                        wingMan.fx.clearFX(wingMan);
                    }
                    wingMan.isUnderEffect = true;
                    effect = new shieldsEffect();
                    wingMan.fx = effect;
                    break;
                case 2:
                    if (wingMan.fx) {
                        wingMan.fx.clearFX(wingMan);
                    }
                    wingMan.isUnderEffect = true;
                    effect = new shrinkEffect(32);
                    wingMan.fx = effect;
                    break;
                case 3:
                    if (wingMan.fx) {
                        wingMan.fx.clearFX(wingMan);
                    }
                    wingMan.isUnderEffect = true;
                    var effect = new drunkEffect();
                    wingMan.fx = effect;
                    break;
            }
        });

        this.ws.on("shipMoved", function(data) {
            if (this.globals.IsGameStarted) {
                this.globals.player2Ship.x = data.x;
                this.globals.player2Ship.y = data.y;
            }
        });
    };

    core.prototype.gameloop = function() {
        var that = this;
        this.globals.frameCounter++;
        if (!this.globals.IsGameStarted) {
            if (this.globals.frameCounter % 60 == 0 && this.globals.frameCounter <
                420) {
                draw.drawTimer(this.globals.CountdownTimer);
                this.globals.CountdownTimer--;
                if (this.globals.CountdownTimer <= 0) {
                    this.globals.IsGameStarted = true;
                }
            }
        } else {
            this.globals.scorePlayer1++;
            this.globals.scorePlayer2++;
            this.draw.drawBackround();
            this.draw.drawScores();
            this.draw.drawRocks();
            this.draw.drawBonus();
            this.draw.drawLifeBar(this.globals.player1Ship.damageBar, 1);
            this.draw.drawLifeBar(this.globals.player2Ship.damageBar, 2);
            this.draw.drawPlayer(this.globals.player1Ship);
            this.draw.drawPlayer(this.globals.player2Ship);
            this.update.checkColision();
            this.update.updateBonusEffect(this.globals.player1Ship);
            this.update.updateBonusEffect(this.globals.player2Ship);
            this.draw.drawText(this.globals.onScreenText);
        }
        window.requestAnimFrame(function() {
            that.gameloop();
        });
    };

    core.prototype.startEngine = function() {
        this.draw = new engine.draw(this);
        this.update = new engine.update(this);
        this.globals.imageRock.src = "Images/asteroid.png";
        this.globals.imageObjBackground.src = "Images/space_background.jpg";
        this.globals.imageBonus.src = "Images/bonus1.png";

        this.globals.canvas = document.getElementById('myCanvas');
        this.globals.context = this.globals.canvas.getContext('2d');
        this.initPlayers();
        this.initAnimations();
        this.initServerConnection();
    };

    engine.core = core;

}(engine || (engine = {})));
