var engine;
(function(engine) {

    var core = (function() {

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

    core.prototype.initPlayers = function() {
        this.globals.player1Ship = new engine.ship('player', 200, 430, 120, 120);
        this.globals.player1Ship.image.src = 'Images/spaceship1.png';

        // Player 2
        this.globals.player2Ship = new engine.ship('wingman', 700, 430, 60, 60);
        this.globals.player2Ship.image.src = 'Images/spaceship2.png';
    };

    core.prototype.initAnimations = function() {
        var i, j = 0,
            k = 0;
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

    core.prototype.initHubConnection = function() {
        var qs = "roomId=1" + "&userId=2";
        var that = this;

        this.hub = new XSockets.WebSocket('ws://localhost:4502/SpaceMadness');

        this.hub.on(XSockets.Events.open, function(data) {
            console.log('Open', data);

            that.hub.publish("joinGame", {
                userId: 1,
                roomId: 2
            });

        });

        this.hub.on("wingManMove", function(data) {
            if (that.globals.IsGameStarted) {
                that.globals.player2Ship.x = data.x;
                that.globals.player2Ship.y = data.y;
            }
        });

        this.hub.on("wingManExplode", function(data) {
            if (that.globals.IsGameStarted) {
                that.globals.player2Ship.takeHit();
                updateScore(2, "hit");
            }
        });

        that.hub.on("wingmanBump", function() {
            var effect = new effects.bumpEffect(false);
            that.globals.player1Ship.fx = effect;
            that.globals.player1Ship.isUnderEffect = true;
            console.log("bumped");
        });

        this.hub.on("setRockData", function(rock) {
            this.globals.rocksArr[rock.index] = new spaceRock(rock);
        });

        this.hub.on("addRock", function(rock) {
            if (that.globals.rocksArr.length < 20)
                that.globals.rocksArr.push(rock);
            if (DEBUG)
                console.log("rockAdded - Array Length : ", that.globals.rocksArr.length);
        });

        this.hub.on("setRockArray", function(data) {
            var i;
            for (i = 0; i < data.length; i++) {
                this.globals.rocksArr[i] = new spaceRock(data.X, data.Y, data.Speed, data.Angle, data.RotationSpeed, data.Width, data.Height);

            }
        });

        this.hub.on("setBonusData", function(data) {
            var now = moment().format('h:mm:ss');
            updateBonus(data);
        });

        this.hub.on("startGame", function(playerIndex) {
            switch (playerIndex) {
                case 1:
                    // this.globals.player1Ship.image.src = 'Images/spaceship1.png'
                    this.globals.player1Ship.image.src = 'Images/New ship/tmp-35.gif';
                    this.globals.player2Ship.image.src = 'Images/spaceship2.png';
                    this.globals.player1Ship.Transform = true;
                    this.globals.player1Ship.frameIndex = 0;

                    break;
                case 2:
                    this.globals.player1Ship.image.src = 'Images/spaceship2.png';
                    this.globals.player2Ship.image.src = 'Images/spaceship1.png';
                    this.globals.player1Ship.x = this.globals.player2Ship.x;
                    this.globals.player1Ship.y = this.globals.player2Ship.y;
                    this.globals.player2Ship.x = this.globals.player1Ship.oldX;
                    this.globals.player2Ship.y = this.globals.player1Ship.oldY;

                    break;

            }
            showMessage("Click 'Esc' to exit the room !!!");
            this.globals.backGroundSpeed = 2;
            this.hub.server.initRockArray();
            this.gameLoop();
        });

        this.hub.on("playerWait", function(data) {
            showMessage("Wait for another player to arrive ...");
            drawBackround();
            drawScore.cores();
            drawLifeBar(newEngine.core.globals.player1Ship.damageBar, 1);
            drawLifeBar(wingMan.damageBar, 2);
            drawPlayer(newEngine.core.globals.player1Ship);
            drawPlayer(wingMan);
        });

        this.hub.on("redirectToLobby", function(urlTarget, msg) {
            showMessage(msg);
            FPS = 0;
            window.location = urlTarget;
        });

        this.hub.on("playerTakeBonus", function(data) {
            bonusArr[data.bonusIndex].timeout = 0;
            switch (data.type) {
                case 0:
                    updateSnewEngine.core(2, "bonus");
                    break;
                case 1:
                    if (wingMan.fx) {
                        wingMan.fx.clearFX(wingMan);
                    }
                    wingMan.isUnderEffect = true;
                    var effect = new shieldsEffect();
                    wingMan.fx = effect;
                    break;
                case 2:
                    if (wingMan.fx) {
                        wingMan.fx.clearFX(wingMan);
                    }
                    wingMan.isUnderEffect = true;
                    var effect = new shrinkEffect(32);
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

        this.hub.on("shipMoved", function(data) {
            if (IsGameStarted) {
                this.globals.player2Ship.x = x;
                this.globals.player2Ship.y = y;
            }
        });

    };

    core.prototype.gameloop = function(draw, update) {
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
            this.globals.scorePlayer1++;
            this.globals.scorePlayer2++;
            draw.drawBackround();
            draw.drawScores();
            draw.drawRocks();
            draw.drawBonus();
            draw.drawLifeBar(this.globals.player1Ship.damageBar, 1);
            draw.drawLifeBar(this.globals.player2Ship.damageBar, 2);
            draw.drawPlayer(this.globals.player1Ship);
            draw.drawPlayer(this.globals.player2Ship);
            update.checkColision();
            update.updateBonusEffect(this.globals.player1Ship);
            update.updateBonusEffect(this.globals.player2Ship);
            draw.drawText(this.globals.onScreenText);
        }
        window.requestAnimFrame(this.gameloop(draw, update));
    };

    core.prototype.startEngine = function(draw, update) {
        this.globals.imageRock.src = "Images/asteroid.png";
        this.globals.imageObjBackground.src = "Images/space_background.jpg";
        this.globals.imageBonus.src = "Images/bonus1.png";

        this.globals.canvas = document.getElementById('myCanvas');
        this.globals.context = this.globals.canvas.getContext('2d');
        this.initPlayers();
        this.initAnimations();
        this.initHubConnection();
        // this.gameloop();
        // window.requestAnimFrame(this.gameloop(draw,update));
    };

    engine.core = core;

}(engine || (engine = {})));
