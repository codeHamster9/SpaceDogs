var engine;
(function (engine) {
    var update = (function (core) {

        function update(core) {
            this.core = core;
        }
        return update;
    }());

    update.prototype.updateBonus = function (data) {
        if (IsGameStarted) {
            //bonusArr = data;
            var i;
            for (i = 0; i < data.bonusim.length; i++) {
                core.globals.bonusArr[i] = new bonusItem();
                core.globals.bonusArr[i].x = data.bonusim[i].x;
                core.globals.bonusArr[i].y = data.bonusim[i].y;
                core.globals.bonusArr[i].timeout = data.bonusim[i].timeout;
                core.globals.bonusArr[i].value = data.bonusim[i].value;
                core.globals.bonusArr[i].type = data.bonusim[i].type;
                core.globals.bonusArr[i].effectDuration = data.bonusim[i].effectDuration;
                core.globals.bonusArr[i].width = imageBonus.width;
                core.globals.bonusArr[i].height = imageBonus.height;
            }
        }
    };

    update.prototype.updateScore = function (playerIndex, updateType) {
        switch (updateType) {
            case "bonus":
                switch (playerIndex) {
                    case 1:
                        scorePlayer1 += 1000;
                        break;
                    case 2:
                        scorePlayer2 += 1000;
                        break;
                }
                break;

            case "hit":
                switch (playerIndex) {
                    case 1:
                        if (this.core.globals.scorePlayer1 > 500) {
                            this.core.globals.scorePlayer1 -= 500;
                        } else {
                            this.core.globals.scorePlayer1 = 0;
                        }
                        break;
                    case 2:
                        if (this.core.globals.scorePlayer2 > 500) {
                            this.core.globals.scorePlayer2 -= 500;
                        }
                        else {
                            this.core.globals.scorePlayer2 = 0;
                        }
                        break;
                }
                break;
        }
    };

    update.prototype.updateBonusEffect = function (ship) {
        if (ship.isUnderEffect) {
            ship.applyEffect();
        }
    };

    update.prototype.checkColision = function () { //make more generic collidable interface;
        var i, deltax, deltay, dist, effect, weffect;
        if (!core.globals.player1Ship.isHit && !core.globals.player1Ship.shieldsUp) {
            var shipCenter = getCenterPoint(core.globals.player1Ship);
            var wingManCenter = getCenterPoint(wingMan);
            for (i = 0; i < rocksArr.length; ++i) {
                var rockCenter = getCenterPoint(rocksArr[i]);
                deltax = shipCenter.x - rockCenter.x;
                deltay = shipCenter.y - rockCenter.y;
                dist = Math.sqrt(deltax * deltax + deltay * deltay);
                if (dist < 30) {
                    updateScore(1, "hit");
                    core.globals.player1Ship.explode(i);
                }
            }
            if (!isHelmsLocked) {
                deltax = shipCenter.x - wingManCenter.x;
                deltay = shipCenter.y - wingManCenter.y;
                dist = Math.sqrt(deltax * deltax + deltay * deltay);
                if (dist < 30) {
                    isHelmsLocked = true;
                    //updateScore(1, "hit");
                    console.log("player collide");
                    if (core.globals.player1Ship.x > wingMan.x) {
                        effect = new bumpEffect(true);
                        core.globals.player1Ship.isUnderEffect = true;
                        core.globals.player1Ship.fx = effect;
                        weffect = new bumpEffect(false);
                        wingMan.isUnderEffect = true;
                        wingMan.fx = weffect;
                    } else {
                        effect = new bumpEffect(false);
                        core.globals.player1Ship.isUnderEffect = true;
                        core.globals.player1Ship.fx = effect;
                        weffect = new bumpEffect(true);
                        wingMan.isUnderEffect = true;
                        wingMan.fx = weffect;
                    }
                    //core.globals.player1Ship.explode(i);
                }
            }
        }

        for (i = 0; i < bonusArr.length; ++i) {
            if (bonusArr[i].timeout > 0) {
                var center = getCenterPoint(bonusArr[i]);

                // chekc if bonusItem is Taken
                if (center.x >= core.globals.player1Ship.x - 10 && center.x <= core.globals.player1Ship.x + 70) {
                    if (center.y + 25 >= core.globals.player1Ship.y + 10 && center.y + 25 <= core.globals.player1Ship.y + 80) {
                        bonusArr[i].timeout = 0;
                        if (bonusArr[i].type == 0) {
                            updateScore(1, "bonus");
                            console.log("points");
                        } else switch (bonusArr[i].type) {
                            case 1:
                                if (core.globals.player1Ship.fx) {
                                    core.globals.player1Ship.fx.clearFX(core.globals.player1Ship);
                                }

                                core.globals.player1Ship.isUnderEffect = true;
                                effect = new shieldsEffect();
                                core.globals.player1Ship.fx = effect;
                                onScreenText = "Shields Up!";
                                break;
                            case 2:
                                if (core.globals.player1Ship.fx) {
                                    core.globals.player1Ship.fx.clearFX(core.globals.player1Ship);
                                }
                                core.globals.player1Ship.isUnderEffect = true;
                                effect = new shrinkEffect(32);
                                core.globals.player1Ship.fx = effect;
                                onScreenText = "Shrink Ray!";
                                break;
                            case 3:

                                if (core.globals.player1Ship.fx) {
                                    core.globals.player1Ship.fx.clearFX(core.globals.player1Ship);
                                }
                                core.globals.player1Ship.isUnderEffect = true;
                                effect = new drunkEffect(3);
                                core.globals.player1Ship.fx = effect;
                                onScreenText = "Drunk Driving!";
                                break;
                        }
                        hub.server.playerTakesBonus(bonusArr[i].type, i);
                    }
                }
            }
        }
    };

    update.prototype.whatKey = function (evt) {
        if (!core.globals.player1Ship.isHit && !isHelmsLocked && isHelmsLocked) {
            // Flag to put variables back if we hit an edge of the board.
            var flag = 0;

            // Get where the ship was before key process.
            core.globals.player1Ship.oldX = core.globals.player1Ship.x;
            core.globals.player1Ship.oldY = core.globals.player1Ship.y;

            switch (evt.keyCode) {
                case 37: // Left arrow.
                    core.globals.player1Ship.x = core.globals.player1Ship.x - 30;
                    if (core.globals.player1Ship.x < 30) {
                        // If at edge, reset ship position and set flag.
                        core.globals.player1Ship.x = 30;
                        flag = 1;
                    }
                    break;
                case 39: // Right arrow.
                    core.globals.player1Ship.x = core.globals.player1Ship.x + 30;
                    if (core.globals.player1Ship.x > backGroundX - 30) {
                        // If at edge, reset ship position and set flag.
                        core.globals.player1Ship.x = backGroundX - 30;
                        flag = 1;
                    }
                    break;
                case 40: // Down arrow
                    core.globals.player1Ship.y = core.globals.player1Ship.y + 30;
                    if (core.globals.player1Ship.y > backGroundY) {
                        // If at edge, reset ship position and set flag.
                        core.globals.player1Ship.y = backGroundY;
                        flag = 1;
                    }
                    break;
                case 38: // Up arrow 
                    core.globals.player1Ship.y = core.globals.player1Ship.y - 30;
                    if (core.globals.player1Ship.y < 0) {
                        // If at edge, reset ship position and set flag.
                        core.globals.player1Ship.y = 0;
                        flag = 1;
                    }
                    break;
                case 89: /// 'Y' for confirm exit
                    if (isReadyToExit) {
                        console.log(roomId);
                        hub.server.endGame(roomId);
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
            if (flag && !isHelmsLocked) {
                core.globals.player1Ship.x = core.globals.player1Ship.oldX;
                core.globals.player1Ship.y = core.globals.player1Ship.oldY;
            } else {
                this.core.hub.server.moveShip(core.globals.player1Ship.x, core.globals.player1Ship.y, "");
            }
        }
    };

    update.prototype.mouseMove = function (evt) {
        if ((evt.clientX < backGroundX && evt.clientY < backGroundY) && (evt.clientX > 0 && evt.clientY > 0)) {
            evt.preventDefault();
            if (!core.globals.player1Ship.isHit && IsGameStarted && !isHelmsLocked) {
                this.core.globals.player1Ship.x = evt.clientX;
                core.globals.player1Ship.y = evt.clientY;
                this.core.hub.server.moveShip(core.globals.player1Ship.x, core.globals.player1Ship.y, "");
            }
            this.style.cursor = 'none';
        } else {
            this.style.cursor = 'auto';
        }
    };

    engine.update = update;

}(engine));
