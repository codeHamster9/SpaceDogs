//'use strict';
var engine = {};
engine.models = {};

(function(engine) {
    var DEBUG = false,
        core = (function() {

            function Core() {
                this.globals = {
                    // move to draw module

                    Damage_MAX: 420,
                    Hit_Value: 35,

                    // value's for the bonus
                    frameCounter: 0,
                    bonusArr: [],

                    // value's for rotate the rock's

                    explosionArray: new Array(),
                    rocksArr: [],
                    shipTransform: [],

                    scorePlayer2: 0,
                    scorePlayer1: 0,
                    player1Ship: null,
                    player2Ship: null,
                    CountdownTimer: 2,
                    IsGameStarted: false,
                    isReadyToExit: false,
                    IsSquadLeader: false,
                    frameCounter : 0,
                    FPS: 1000 / 30,
                    onScreenText: ""
                };
                this.draw = null;
                this.update = null;
                this.ws = {};
            }

            return Core;

        }());

    core.prototype.initPlayers = function() {
        this.globals.player1Ship = new engine.models.ship('squadLeader', 200, 430, 60, 60, 'Images/spaceship1.png');
        this.globals.player2Ship = new engine.models.ship('wingman', 700, 430, 60, 60, 'Images/spaceship2.png');
        this.update.setPlayers(this.globals.player1Ship,this.globals.player2Ship);
        this.draw.setPlayers(this.globals.player1Ship,this.globals.player2Ship)
    };

    core.prototype.initAnimations = function() {
        var i, j = 0,
            k = 0;
        for (i = 0; i < 7 * 5; i++) {
            this.globals.explosionArray[i] = "Images/Frames/e" + (j + 1) + ".png";
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
        var core = this,
            player1 = this.globals.player1Ship,
            player2 = this.globals.player2Ship,

            url = 'ws://localhost:4502',
            controller = '/SpaceMadness',
            settings = {
                gameId: '22'
            };

        // this.ws = new XSockets.WebSocket(url + controller + '?gameId=' + settings.gameId);
        this.ws = new XSockets.WebSocket('ws://localhost:4502/SpaceMadness?gameId=22');



        this.ws.on(XSockets.Events.open, function(data) {
            console.log('Open', data);

            core.ws.publish("joinGame", {
                roomId: '22'
            });
            core.draw.setSocket(core.ws);    
            core.update.socket = core.ws;
        });

        this.ws.on(XSockets.Events.close, function(data) {
            console.log('Close', data);
        });

        this.ws.on("wingManMove", function(data) {
            // if (core.globals.IsGameStarted) {
                player2.x = data.x;
                player2.y = data.y;
            // }
        });

        this.ws.on("wingManExplode", function(data) {
            if (core.globals.IsGameStarted) {
                player2.takeHit();
                core.update.updateScores(2, "hit");
            }
        });

        core.ws.on("wingmanBump", function() {
            player1.fx = new fx.bump(false);
            player1.isUnderEffect = true;
            console.log("bumped");
        });

        this.ws.on("wingmanTakesBonus", function(data) {
            bonusArr[data.bonusIndex].timeout = 0;

            var wingman = player1;

            switch (data.type) {
                case 0:
                    core.update.updateScore(1000, "wingman");
                    break;
                case 1:
                    if (wingMan.fx) {
                        wingMan.fx.clearFX(wingMan);
                    }
                    wingMan.fx = new fx.shield();
                    break;
                case 2:
                    if (wingMan.fx) {
                        wingMan.fx.clearFX(wingMan);
                    }
                    wingMan.fx = new fx.shrink(32);
                    break;
                case 3:
                    if (wingMan.fx) {
                        wingMan.fx.clearFX(wingMan);
                    }
                    wingMan.fx = new fx.drunk(30, cglbl.backGroundX);
                    break;
            }
        });

        this.ws.on("setNewRock", function(rock) {
            core.globals.rocksArr[rock.index] = rock;
            if (DEBUG)
                console.info(common.utils.timeNow(), rock.index);
        });

        this.ws.on("setItemsData", function(data) {
            core.update.updateBonus(data);
            if (DEBUG)
                console.warn(common.utils.timeNow(), data);
        });

        this.ws.on("startGame", function(data) {


            switch (core.globals.IsSquadLeader) {

                case false:
                    player1.image.src = 'Images/spaceship2.png';
                    player2.image.src = 'Images/spaceship1.png';

                    var oldPos = player1.getPosition();
                    player1.getPosition().x = player2.getPosition().x;
                    player1.getPosition().y = player2.getPosition().y;
                    player2.getPosition().x = oldPos.x;
                    player2.getPosition().y = oldPos.y;
                    break;
            }

            window.showMessage("Click 'Esc' to exit the room !!!");
            core.globals.rocksArr = data;
            core.globals.backGroundSpeed = 2;
            core.globals.IsGameStarted = true;
            player1.helmslock = false;
            player2.helmslock = false;

            core.gameloop();
        });

        this.ws.on("playerWait", function() {
            window.showMessage("Wait for another player to arrive ...");
            core.draw.drawBackround();
            core.draw.drawScores();
            core.draw.drawLifeBar(player1.health, 1);
            core.draw.drawLifeBar(player2.health, 2);
            core.draw.drawPlayers();
            core.globals.IsSquadLeader = true;
        });

        this.ws.on("endGame", function(urlTarget) {
            showMessage('Game aborted');
            FPS = 0;
            core.ws.close();
            // window.location = urlTarget;
        });

        this.ws.on("shipMoved", function(data) {
            // if (core.globals.IsGameStarted) {
                player2.moveHorizontl(data.x);
                player2.moveVertical(data.y);
            // }
        });
    };

    core.prototype.gameloop = function() {
        var core = this;
        this.globals.frameCounter++;
        if (!this.globals.IsGameStarted) {
            if (this.globals.frameCounter % 60 == 0 && this.globals.frameCounter < 420) {
                draw.drawTimer(this.globals.CountdownTimer);
                this.globals.CountdownTimer--;
                if (this.globals.CountdownTimer <= 0) {
                    this.globals.IsGameStarted = true;
                }
            }
        } else {
            this.draw.drawBackround();
            this.draw.drawScores(this.globals.scorePlayer1,this.globals.scorePlayer2);
            this.draw.drawRocks();
            this.draw.drawBonus();
            this.draw.drawLifeBar();
            this.draw.drawPlayers();
            this.update.checkColision();
            this.update.updateBonusEffect(this.globals.player1Ship);
            this.update.updateBonusEffect(this.globals.player2Ship);
            this.update.updateScores(1);
            this.draw.drawText();
        }

        this.globals.frameCounter++;

        window.requestAnimFrame(function() {
            core.gameloop();
        });
    };

    core.prototype.startEngine = function() {
        this.draw = new engine.draw(0,this.globals);
        this.update = new engine.update(this.globals,840,440);
        this.draw.init();    
        this.initPlayers();
        this.update.init();

        this.initAnimations();
        this.initServerConnection();
    };

    engine.core = core;

}(engine || (engine = {})));
