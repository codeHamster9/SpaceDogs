//'use strict';
var engine = {};
engine.models = {};

(function(engine) {
    var DEBUG = false,
        core = (function() {

            function Core() {
                var _state = {
                    
                    maxDamage: 420,
                    rockHitVal: 35,
                    scorePerSecond: 1,
                    scores: {
                        score1: 0,
                        score2: 0
                    },
                    itemArr: new Array(),
                    rocksArr: new Array(),
                    player1Ship: null,
                    player2Ship: null,
                    gameOn: false,
                    IsReadyToExit: false,
                    IsSquadLeader: false,
                    FPS: 1000 / 30,
                    wingmanItem: null,
                    onScreenText: ""
                },
                    _draw = null,
                    _update = null,
                    _ws = {};

                function initPlayers() {
                    _state.player1Ship = new engine.models.ship('squadLeader', 200, 430, 60, 60, 'Images/spaceship1.png');
                    _state.player2Ship = new engine.models.ship('wingman', 700, 430, 60, 60, 'Images/spaceship2.png');
                    _update.setPlayers(_state.player1Ship, _state.player2Ship);
                    _draw.setPlayers(_state.player1Ship, _state.player2Ship)
                };

                function gameloop() {
                    _draw.run(_state);
                    _update.run(_state);

                    window.requestAnimFrame(function() {
                        gameloop();
                    });
                };

                function initServerConnection() {
                    var url = 'ws://localhost:4502',
                        controller = '/SpaceMadness',
                        settings = {
                            gameId: '22'
                        };

                    _ws = new XSockets.WebSocket(url + controller + '?gameId=' + settings.gameId);
                    // _ws = new XSockets.WebSocket('ws://localhost:4502/SpaceMadness?gameId=22');

                    _ws.on(XSockets.Events.open, function(data) {
                        console.log('Open', data);

                        _ws.publish("joinGame", {});
                        _draw.setSocket(_ws);
                        _update.setSocket(_ws);

                    });

                    _ws.on(XSockets.Events.close, function(data) {
                        console.log('Close', data);
                    });

                    _ws.on("wingManExplode", function(data) {
                        _state.player2Ship.takeHit();
                        // core.update.updateScores(-500, "wingman");
                    });

                    _ws.on("wingmanBump", function() {
                        // player1.fx = new fx.bump(false);
                        // player1.isUnderEffect = true;
                        console.log("bumped");
                    });

                    _ws.on("wingmanTakesBonus", function(data) {
                        _state.wingmanItem = data;
                    });

                    _ws.on("setNewRock", function(rock) {
                        _state.rocksArr[rock.index] = rock;

                        if (DEBUG)
                            console.info(common.utils.timeNow(), rock.index);
                    });

                    _ws.on("setItemsData", function(data) {
                        _state.itemArr = data;

                        if (DEBUG)
                            console.warn(common.utils.timeNow(), data);
                    });

                    _ws.on("startGame", function(data) {
                        _state.rocksArr = data;
                        _state.gameOn = true;
                    });

                    _ws.on("getReady", function() {
                        window.showMessage("Click 'Esc' to exit the room !!!");
                        gameloop();
                    });

                    _ws.on("playerWait", function() {
                        window.showMessage("Wait for another player to arrive ...");
                        _state.IsSquadLeader = true;
                        _draw.run(_state);
                    });

                    _ws.on("endGame", function(urlTarget) {
                        showMessage('Game aborted');
                        _state.FPS = 0;
                        _ws.close();
                        // window.location = urlTarget;
                    });

                    _ws.on("shipMoved", function(data) {
                        _state.player2Ship.moveHorizontl(data.x);
                        _state.player2Ship.moveVertical(data.y);
                        if (DEBUG)
                            console.log("shipMoved", data);
                    });
                };

                this.startEngine = function() {

                    window.requestAnimFrame = (function() {
                        return window.requestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            function(callback) {
                                window.setInterval(gameLoop, _state.FPS);
                        };
                    }());

                    _draw = new engine.draw(0);
                    _update = new engine.update(840, 440);
                    _draw.init();
                    initPlayers();
                    _update.init();
                    initServerConnection();
                };
            }

            return Core;

        }());
    engine.core = core;

}(engine || (engine = {})));
