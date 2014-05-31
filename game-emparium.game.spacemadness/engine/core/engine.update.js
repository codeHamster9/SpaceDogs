var engine, fx, common;
(function(engine) {
    //'use strict';
    var
    DEBUG = false,
        update = (function() {

            function Update(x, y) {
                var _socket = null,
                    _backGroundX = x,
                    _backGroundY = y,
                    _c = null;

                this.init = function(state) {
                    if (window.addEventListener) {
                        window.addEventListener('mousemove', mouseMove.bind(this), false);
                        window.addEventListener('keydown', whatKey.bind(this), false);
                    } else if (window.attachEvent) {
                        window.attachEvent('onmousemove', mouseMove.bind(this));
                        window.attachEvent('onkeydown', whatKey.bind(this));
                    }
                    _c = state;
                };

                this.run = function() {
                    checkColision();
                    wingmanItemPickup();
                    updateItemEffect();
                    updateScores();
                };

                this.setSocket = function(socket) {
                    _socket = socket;
                };

                function updateScores() {
                    var value = _c.scorePerSecond;
                    if (_c.gameOn) {
                        if (_c.scores.score1 + value > 0)
                            _c.scores.score1++;
                        else
                            _c.scores.score1 = 0;

                        if (_c.scores.score2 + value > 0)
                            _c.scores.score2++;
                        else
                            _c.scores.score2 = 0;
                    }
                };

                function updateItemEffect() {

                    if (_c._player1.fx) {
                        _c._player1.fx.apply(_c._player1);
                    } else {
                        // _c.onScreenText = "";
                    }
                };

                function wingmanItemPickup() {
                    var item = _c.wingmanItem;
                    if (item) {
                        _c.itemArr[item.bonusIndex].timeout = 0;

                        if (_c._player2.fx && item.type != "Points") {
                            _c._player2.fx.clearFX(_c._player2);
                        }
                        switch (item.type) {

                            case "Points":
                                _c.scores.score2 += 1000;
                                break;
                            case "Shield":
                                _c._player2.fx = new fx.shield();
                                _c.onScreenText = "Shields Up!";
                                break;
                            case "Shrink":
                                _c._player2.fx = new fx.shrink(32);
                                _c.onScreenText = "Shrink Ray!";
                                break;
                            case "Drunk":
                                _c._player2.fx = new fx.drunk(30, _backGroundX);
                                _c.onScreenText = "Drunk Driving!";
                                break;
                        }
                    }
                };

                function checkColision() {
                    var i, deltax, deltay, dist, radius, shipCenter,
                        center, rockCenter, collidables = [],
                        buffer = 13;

                    if (!_c._player1.isHit) {
                        if (_c.rocksArr && _c.rocksArr.length > 0)
                            collidables = _c.rocksArr;

                        if (_c.itemArr && _c.itemArr.length > 0)
                            collidables = collidables.concat(_c.itemArr);

                        // collidables = collidables.concat(_player2Ship);

                        if (!collidables)
                            return;

                        shipCenter = _c._player1.getShipCenter();

                        for (i = 0; i < collidables.length; ++i) {

                            radius = collidables[i].width / 2;
                            deltax = shipCenter.x - collidables[i].x;
                            deltay = shipCenter.y - collidables[i].y;
                            dist = Math.floor(Math.sqrt(deltax * deltax + deltay * deltay));
                            collidables[i].distance = dist;

                            //collision Test!
                            if (dist < radius + buffer) {

                                switch (collidables[i].type) {
                                    /* case "Ship":
                            if (!_isHelmsLocked) {
                                if (_c._player1.x > _player2Ship.x) {
                                    me = true;
                                    wingman = false;
                                } else {
                                    me = false;
                                    wingman = true;
                                }
                                _c._player1.isUnderEffect = true;
                                _player2Ship.isUnderEffect = true;
                                _c._player1.fx = new fx.bump(me);
                                _player2Ship.fx = new fx.bump(wingman);
                                _isHelmsLocked = true;
                                console.log("player collide");
                            }*/
                                    case "Rock":
                                        if (!_c._player1.shieldsUp) {
                                            _c.scores.score1 += -500;
                                            _c._player1.takeHit(35);
                                            _socket.publish("playerExplode", {
                                                index: i
                                            });
                                        }
                                        break;
                                    case "Points":
                                        _c.scores.score1 += 1000;
                                        break;
                                    default:
                                        collidables[i].timeout = 0;
                                        var fxGen = new fx.itemFactory();
                                        _c._player1.fx = fxGen.getFx(collidables[i].type);
                                        if (!DEBUG)
                                            console.log(collidables[i].type);
                                }


                                _socket.publish("playerTakesBonus", {
                                    type: collidables[i].type,
                                    index: i
                                });
                            }
                        }
                    }
                };

                function whatKey(evt) {
                    if (!_c._player1.isHit && !_c._player1.helmslock) {
                        // Flag to put variables back if we hit an edge of the board.
                        var flag = 0;

                        // Get where the ship was before key process.
                        _c._player1.oldX = _c._player1.x;
                        _c._player1.oldY = _c._player1.y;

                        switch (evt.keyCode) {
                            case 37: // Left arrow.
                                _c._player1.x = _c._player1.x - 30;
                                if (_c._player1.x < 30) {
                                    // If at edge, reset ship position and set flag.
                                    _c._player1.x = 30;
                                    flag = 1;
                                }
                                break;
                            case 39: // Right arrow.
                                _c._player1.x = _c._player1.x + 30;
                                if (_c._player1.x > _backGroundX - 30) {
                                    // If at edge, reset ship position and set flag.
                                    _c._player1.x = _backGroundX - 30;
                                    flag = 1;
                                }
                                break;
                            case 40: // Down arrow
                                _c._player1.y = _c._player1.y + 30;
                                if (_c._player1.y > _backGroundY) {
                                    // If at edge, reset ship position and set flag.
                                    _c._player1.y = _backGroundY;
                                    flag = 1;
                                }
                                break;
                            case 38: // Up arrow 
                                _c._player1.y = _c._player1.y - 30;
                                if (_c._player1.y < 0) {
                                    // If at edge, reset ship position and set flag.
                                    _c._player1.y = 0;
                                    flag = 1;
                                }
                                break;
                            case 89: /// 'Y' for confirm exit
                                if (isReadyToExit) {
                                    console.log(roomId);
                                    ws.publish(roomId, "endGame");
                                }
                                break;
                            case 27: // 'Esc'
                                isReadyToExit = true;
                                showMessage("Are You Sure Y/N ?");
                                break;
                            case 78: // No
                                showMessage("Click 'Esc' to exit the room !!!");
                                isReadyToExit = false;
                                break;
                        }

                        // If flag is set, the ship did not move.
                        // Put everything back the way it was.
                        if (flag && !_c._player1.helmslock) {
                            _c._player1.x = _c._player1.oldX;
                            _c._player1.y = _c._player1.oldY;
                        } else {
                            _socket.publish("moveShip", _c._player1.getPosition());
                        }
                    }
                };

                function mouseMove(evt) {
                    if ((evt.clientX < _backGroundX && evt.clientY < _backGroundY) &&
                        (evt.clientX > 0 && evt.clientY > 0)) {

                        evt.preventDefault();

                        if (!_c._player1.isHit && !_c._player1.helmslock) {

                            _c._player1.moveHorizontl(evt.clientX);
                            _c._player1.moveVertical(evt.clientY);
                            _socket.publish("moveShip", _c._player1.getPosition());
                        }
                    }
                };
            }
            return Update;
        }());

    engine.update = update;

}(engine));
