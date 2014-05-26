var engine, effects, common;
(function(engine) {
    var cglbl,
        update = (function(globals) {

            function Update(globals, x, y) {
                _socket = null;
                _backGroundX = x;
                _backGroundY = y;
                _player1 = null;
                _player2 = null;
                cglbl = globals;
            }
            return Update;
        }());

    update.prototype.init = function() {
        if (window.addEventListener) {
            window.addEventListener('mousemove', this.mouseMove.bind(this), false);
            window.addEventListener('keydown', this.whatKey.bind(this), false);
        } else if (window.attachEvent) {
            window.attachEvent('onmousemove', this.mouseMove.bind(this));
            window.attachEvent('onkeydown', this.whatKey.bind(this));
        }
    };

    update.prototype.setPlayers = function(player1, player2) {
        _player1 = player1;
        _player2 = player2;
    };

    update.prototype.updateBonus = function(data) {
        cglbl.bonusArr = data;
    };

    update.prototype.updateScores = function(value, player) {

        switch (player) {
            case "leader":
                if (cglbl.scorePlayer1 += value > 0)
                    cglbl.scorePlayer1 += value;
                else
                    cglbl.scorePlayer1 = 0;
                break;
            case "wingman":

                if (cglbl.scorePlayer2 += value > 0)
                    cglbl.scorePlayer2 += value;
                else
                    cglbl.scorePlayer2 = 0;
                break;
            default:
                cglbl.scorePlayer1 += value;
                cglbl.scorePlayer2 += value;
                break;
        }
    };

    update.prototype.updateBonusEffect = function(ship) {
        if (ship.fx) {
            ship.fx.apply(ship);
        } else {
            cglbl.onScreenText = "";
        }
    };

    update.prototype.wingmanItemPickup = function(data) {
        cglbl.bonusArr[data.bonusIndex].timeout = 0;

        switch (data.type) {
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
    };

    update.prototype.checkColision = function() { //make more generic collidable interface;
        var i, deltax, deltay, dist, radius, shipCenter,
            center, rockCenter, collidables = [],
            buffer = 13;

        if (!_player1.isHit) {
            if (cglbl.rocksArr && cglbl.rocksArr.length > 0)
                collidables = cglbl.rocksArr;

            if (cglbl.bonusArr && cglbl.bonusArr.length > 0)
                collidables = collidables.concat(cglbl.bonusArr);

            // collidables = collidables.concat(cglbl.player2Ship);

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
                            if (!cglbl.isHelmsLocked) {
                                if (_player1.x > cglbl.player2Ship.x) {
                                    me = true;
                                    wingman = false;
                                } else {
                                    me = false;
                                    wingman = true;
                                }
                                _player1.isUnderEffect = true;
                                cglbl.player2Ship.isUnderEffect = true;
                                _player1.fx = new fx.bump(me);
                                cglbl.player2Ship.fx = new fx.bump(wingman);
                                cglbl.isHelmsLocked = true;
                                console.log("player collide");
                            }*/
                        case "Rock":
                            if (!_player1.shieldsUp) {
                                this.updateScores(-500, "leader");
                                _player1.takeHit(35);
                                this.socket.publish("playerExplode", {
                                    index: i
                                });
                            }
                            break;
                        case "Points":
                            this.updateScores(1000, "leader");
                            console.log("Points");
                            break;
                        case "Shield":
                        case "Shrink":
                        case "Drunk":
                            if (_player1.fx) {
                                _player1.fx.clearFX(_player1);
                            }
                            collidables[i].timeout = 0;
                    }

                    switch (collidables[i].type) {
                        case "Shield":
                            _player1.fx = new fx.shield();
                            cglbl.onScreenText = "Shields Up!";
                            break;
                        case "Shrink":
                            _player1.fx = new fx.shrink(32);
                            cglbl.onScreenText = "Shrink Ray!";
                            break;
                        case "Drunk":
                            _player1.fx = new fx.drunk(30, cglbl.backGroundX);
                            cglbl.onScreenText = "Drunk Driving!";
                            break;
                    }
                    this.socket.publish("playerTakesBonus", {
                        type: collidables[i].type,
                        index: i
                    });
                }
            }
        }
    };

    update.prototype.whatKey = function(evt) {
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
                this.socket.publish("moveShip", _player1.getPosition());
            }
        }
    };

    update.prototype.mouseMove = function(evt) {
        if ((evt.clientX < _backGroundX && evt.clientY < _backGroundY) &&
            (evt.clientX > 0 && evt.clientY > 0)) {

            evt.preventDefault();

            if (!_player1.isHit && !_player1.helmslock) {

                _player1.moveHorizontl(evt.clientX);
                _player1.moveVertical(evt.clientY);
                this.socket.publish("moveShip", _player1.getPosition());
            }
        }
    };

    engine.update = update;

}(engine));
