var engine, effects, common;
(function(engine) {
    //'use strict';
    var
    DEBUG = false,
        update = (function() {

            function Update(x, y) {
                var _socket = null,
                    _backGroundX = x,
                    _backGroundY = y,
                    _player1 = null,
                    _player2 = null;

                this.init = function() {
                    if (window.addEventListener) {
                        window.addEventListener('mousemove', mouseMove.bind(this), false);
                        window.addEventListener('keydown', whatKey.bind(this), false);
                    } else if (window.attachEvent) {
                        window.attachEvent('onmousemove', mouseMove.bind(this));
                        window.attachEvent('onkeydown', whatKey.bind(this));
                    }
                };

                this.run = function(core) {
                    checkColision(core.bonusArr, core.rocksArr);
                    wingmanItemPickup(core.wingmanItem, core.bonusArr);
                    updateItemEffect();
                    updateScores();
                };

                this.setPlayers = function(player1, player2) {
                    _player1 = player1;
                    _player2 = player2;
                };

                this.setSocket = function(socket) {
                    _socket = socket;
                };

                function updateScores(score1, score2, value) {

                    if (score1 += value > 0)
                        score1 += value;
                    else
                        score1 = 0;

                    if (score2 += value > 0)
                        score2 += value;
                    else
                        score2 = 0;
                };

                function updateItemEffect() {
                    if (_player1.fx) {
                        _player1.fx.apply(_player1);
                    } else {
                        // cglbl.onScreenText = "";
                    }

                    if (_player2.fx) {
                        _player2.fx.apply(_player2);
                    } else {
                        // cglbl.onScreenText = "";
                    }
                };

                function wingmanItemPickup(item, itemArr) {
                    if (item) {
                        itemArr[item.bonusIndex].timeout = 0;

                        switch (item.type) {
                            case 0:
                                updateScore(1000, "wingman");
                                break;
                            case 1:
                                if (_player2.fx) {
                                    _player2.fx.clearFX(_player2);
                                }
                                _player2.fx = new fx.shield();
                                break;
                            case 2:
                                if (_player2.fx) {
                                    _player2.fx.clearFX(_player2);
                                }
                                _player2.fx = new fx.shrink(32);
                                break;
                            case 3:
                                if (_player2.fx) {
                                    _player2.fx.clearFX(_player2);
                                }
                                _player2.fx = new fx.drunk(30, _backGroundX);
                                break;
                        }
                    }
                };

                function checkColision(bonusArr, rocksArr) {
                    var i, deltax, deltay, dist, radius, shipCenter,
                        center, rockCenter, collidables = [],
                        buffer = 13;

                    if (!_player1.isHit) {
                        if (rocksArr && rocksArr.length > 0)
                            collidables = rocksArr;

                        if (bonusArr && bonusArr.length > 0)
                            collidables = collidables.concat(bonusArr);

                        // collidables = collidables.concat(_player2Ship);

                        if (!collidables)
                            return;

                        shipCenter = _player1.getShipCenter();

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
                                if (_player1.x > _player2Ship.x) {
                                    me = true;
                                    wingman = false;
                                } else {
                                    me = false;
                                    wingman = true;
                                }
                                _player1.isUnderEffect = true;
                                _player2Ship.isUnderEffect = true;
                                _player1.fx = new fx.bump(me);
                                _player2Ship.fx = new fx.bump(wingman);
                                _isHelmsLocked = true;
                                console.log("player collide");
                            }*/
                                    case "Rock":
                                        if (!_player1.shieldsUp) {
                                            updateScores(-500, "leader");
                                            _player1.takeHit(35);
                                            _socket.publish("playerExplode", {
                                                index: i
                                            });
                                        }
                                        break;
                                    case "Points":
                                        updateScores(1000, "leader");

                                        break;
                                    case "Shield":
                                    case "Shrink":
                                    case "Drunk":
                                        if (_player1.fx) {
                                            _player1.fx.clearFX(_player1);
                                        }
                                        collidables[i].timeout = 0;
                                        if (!DEBUG)
                                            console.log(collidables[i].type);
                                }

                                switch (collidables[i].type) {
                                    case "Shield":
                                        _player1.fx = new fx.shield();
                                        _onScreenText = "Shields Up!";
                                        break;
                                    case "Shrink":
                                        _player1.fx = new fx.shrink(32);
                                        _onScreenText = "Shrink Ray!";
                                        break;
                                    case "Drunk":
                                        _player1.fx = new fx.drunk(30, _backGroundX);
                                        _onScreenText = "Drunk Driving!";
                                        break;
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
                    if (!_player1.isHit && !_player1.helmslock) {
                        // Flag to put variables back if we hit an edge of the board.
                        var flag = 0;

                        // Get where the ship was before key process.
                        _player1.oldX = _player1.x;
                        _player1.oldY = _player1.y;

                        switch (evt.keyCode) {
                            case 37: // Left arrow.
                                _player1.x = _player1.x - 30;
                                if (_player1.x < 30) {
                                    // If at edge, reset ship position and set flag.
                                    _player1.x = 30;
                                    flag = 1;
                                }
                                break;
                            case 39: // Right arrow.
                                _player1.x = _player1.x + 30;
                                if (_player1.x > _backGroundX - 30) {
                                    // If at edge, reset ship position and set flag.
                                    _player1.x = _backGroundX - 30;
                                    flag = 1;
                                }
                                break;
                            case 40: // Down arrow
                                _player1.y = _player1.y + 30;
                                if (_player1.y > _backGroundY) {
                                    // If at edge, reset ship position and set flag.
                                    _player1.y = _backGroundY;
                                    flag = 1;
                                }
                                break;
                            case 38: // Up arrow 
                                _player1.y = _player1.y - 30;
                                if (_player1.y < 0) {
                                    // If at edge, reset ship position and set flag.
                                    _player1.y = 0;
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
                        if (flag && !_player1.helmslock) {
                            _player1.x = _player1.oldX;
                            _player1.y = _player1.oldY;
                        } else {
                            _socket.publish("moveShip", _player1.getPosition());
                        }
                    }
                };

                function mouseMove(evt) {
                    if ((evt.clientX < _backGroundX && evt.clientY < _backGroundY) &&
                        (evt.clientX > 0 && evt.clientY > 0)) {

                        evt.preventDefault();

                        if (!_player1.isHit && !_player1.helmslock) {

                            _player1.moveHorizontl(evt.clientX);
                            _player1.moveVertical(evt.clientY);
                            _socket.publish("moveShip", _player1.getPosition());
                        }
                    }
                };
            }
            return Update;
        }());







    engine.update = update;

}(engine));
