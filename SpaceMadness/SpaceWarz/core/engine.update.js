var engine,effects;
(function(engine) {
    var cglbl;
    var update = (function(core) {

        function update(core) {
            this.core = core;
            cglbl = core.globals;
        }
        return update;
    }());

    update.prototype.updateBonus = function(data) {
        if (cglbl.IsGameStarted) {
            //cglbl.bonusArr = data;
            var i;
            for (i = 0; i < data.length; i++) {
                cglbl.bonusArr[i] = new bonusItem();
                cglbl.bonusArr[i].x = data[i].x;
                cglbl.bonusArr[i].y = data[i].y;
                cglbl.bonusArr[i].timeout = data[i].timeout;
                cglbl.bonusArr[i].value = data[i].value;
                cglbl.bonusArr[i].type = data[i].type;
                cglbl.bonusArr[i].effectDuration = data[i].effectDuration;
                cglbl.bonusArr[i].width = cglbl.imageBonus.width;
                cglbl.bonusArr[i].height = cglbl.imageBonus.height;
            }
        }
    };

    update.prototype.updateScore = function(playerIndex, updateType) {
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
                        if (cglbl.scorePlayer1 > 500) {
                            cglbl.scorePlayer1 -= 500;
                        } else {
                            cglbl.scorePlayer1 = 0;
                        }
                        break;
                    case 2:
                        if (cglbl.scorePlayer2 > 500) {
                            cglbl.scorePlayer2 -= 500;
                        } else {
                            cglbl.scorePlayer2 = 0;
                        }
                        break;
                }
                break;
        }
    };

    update.prototype.updateBonusEffect = function(ship) {
        if (ship.isUnderEffect) {
            ship.applyEffect();
        }
    };

    update.prototype.checkColision = function() { //make more generic collidable interface;
        var i, deltax, deltay, dist, effect, weffect, shipCenter, center, rockCenter;
        if (!cglbl.player1Ship.isHit && !cglbl.player1Ship.shieldsUp) {
            var shipCenter = getCenterPoint(cglbl.player1Ship);

            var wingManCenter = getCenterPoint(cglbl.player2Ship);

            for (i = 0; i < cglbl.rocksArr.length; ++i) {
                rockCenter = getCenterPoint(cglbl.rocksArr[i]);
                deltax = shipCenter.x - rockCenter.x;
                deltay = shipCenter.y - rockCenter.y;
                dist = Math.sqrt(deltax * deltax + deltay * deltay);
                if (dist < 30) {
                    this.updateScore(1, "hit");
                    cglbl.player1Ship.explode(i);
                }
            }
            if (!cglbl.isHelmsLocked) {
                deltax = shipCenter.x - cglbl.player2Ship.x;
                deltay = shipCenter.y - cglbl.player2Ship.y;
                dist = Math.sqrt(deltax * deltax + deltay * deltay);
                if (dist < 30) {
                    isHelmsLocked = true;
                    //updateSthis.core(1, "hit");
                    console.log("player collide");
                    if (cglbl.player1Ship.x > cglbl.player2Ship.x) {
                        effect = new effects.bumpEffect(true);
                        cglbl.player1Ship.isUnderEffect = true;
                        cglbl.player1Ship.fx = effect;
                        weffect = new effects.bumpEffect(false);
                        cglbl.player2Ship.isUnderEffect = true;
                        cglbl.player2Ship.fx = weffect;
                    } else {
                        effect = new effects.bumpEffect(false);
                        cglbl.player1Ship.isUnderEffect = true;
                        cglbl.player1Ship.fx = effect;
                        weffect = new effects.bumpEffect(true);
                        cglbl.player2Ship.isUnderEffect = true;
                        cglbl.player2Ship.fx = weffect;
                    }
                    //cglbl.player1Ship.explode(i);
                }
            }
        }

        for (i = 0; i < cglbl.bonusArr.length; ++i) {
            if (cglbl.bonusArr[i].timeout > 0) {
                //TODO:move getCenter to server
                center = getCenterPoint(cglbl.bonusArr[i]);

                // chekc if bonusItem is Taken
                if (center.x >= cglbl.player1Ship.x - 10 && center.x <= cglbl.player1Ship.x + 70) {
                    if (center.y + 25 >= cglbl.player1Ship.y + 10 && center.y + 25 <= cglbl.player1Ship.y + 80) {
                        cglbl.bonusArr[i].timeout = 0;
                        if (cglbl.bonusArr[i].type == 0) {
                            this.updateScore(1, "bonus");
                            console.log("points");
                        } else switch (cglbl.bonusArr[i].type) {
                            case "Shield":
                                if (cglbl.player1Ship.fx) {
                                    cglbl.player1Ship.fx.clearFX(cglbl.player1Ship);
                                }

                                cglbl.player1Ship.isUnderEffect = true;
                                effect = new effects.shieldEffect();
                                cglbl.player1Ship.fx = effect;
                                cglbl.onScreenText = "Shields Up!";
                                break;
                            case "Shrink":
                                if (cglbl.player1Ship.fx) {
                                    cglbl.player1Ship.fx.clearFX(cglbl.player1Ship);
                                }
                                cglbl.player1Ship.isUnderEffect = true;
                                effect = new effects.shrinkEffect(32);
                                cglbl.player1Ship.fx = effect;
                                cglbl.onScreenText = "Shrink Ray!";
                                break;
                            case "Drunk":

                                if (cglbl.player1Ship.fx) {
                                    cglbl.player1Ship.fx.clearFX(cglbl.player1Ship);
                                }
                                cglbl.player1Ship.isUnderEffect = true;
                                effect = new effects.drunkEffect(3);
                                cglbl.player1Ship.fx = effect;
                                cglbl.onScreenText = "Drunk Driving!";
                                break;
                        }
                        this.core.ws.publish("playerTakesBonus", {
                            type: cglbl.bonusArr[i].type,
                            index: i
                        });
                    }
                }
            }
        }
    };

    update.prototype.whatKey = function(evt) {
        if (!this.globals.player1Ship.isHit && !this.globals.isHelmsLocked) {
            // Flag to put variables back if we hit an edge of the board.
            var flag = 0;

            // Get where the ship was before key process.
            this.globals.player1Ship.oldX = this.globals.player1Ship.x;
            this.globals.player1Ship.oldY = this.globals.player1Ship.y;

            switch (evt.keyCode) {
                case 37: // Left arrow.
                    this.globals.player1Ship.x = this.globals.player1Ship.x - 30;
                    if (this.globals.player1Ship.x < 30) {
                        // If at edge, reset ship position and set flag.
                        this.globals.player1Ship.x = 30;
                        flag = 1;
                    }
                    break;
                case 39: // Right arrow.
                    this.globals.player1Ship.x = this.globals.player1Ship.x + 30;
                    if (this.globals.player1Ship.x > this.globals.backGroundX - 30) {
                        // If at edge, reset ship position and set flag.
                        this.globals.player1Ship.x = this.globals.backGroundX - 30;
                        flag = 1;
                    }
                    break;
                case 40: // Down arrow
                    this.globals.player1Ship.y = this.globals.player1Ship.y + 30;
                    if (this.globals.player1Ship.y > this.globals.backGroundY) {
                        // If at edge, reset ship position and set flag.
                        this.globals.player1Ship.y = this.globals.backGroundY;
                        flag = 1;
                    }
                    break;
                case 38: // Up arrow 
                    this.globals.player1Ship.y = this.globals.player1Ship.y - 30;
                    if (this.globals.player1Ship.y < 0) {
                        // If at edge, reset ship position and set flag.
                        this.globals.player1Ship.y = 0;
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
            if (flag && !isHelmsLocked) {
                this.globals.player1Ship.x = this.globals.player1Ship.oldX;
                this.globals.player1Ship.y = this.globals.player1Ship.oldY;
            } else {
                this.ws.publish("moveShip", {
                    x: this.globals.player1Ship.x,
                    y: this.globals.player1Ship.y
                });
            }
        }
    };

    update.prototype.mouseMove = function(evt) {
        if ((evt.clientX < this.globals.backGroundX && evt.clientY < this.globals.backGroundY) && (evt.clientX > 0 && evt.clientY > 0)) {
            evt.preventDefault();
            if (!this.globals.player1Ship.isHit && this.globals.IsGameStarted && !this.globals.isHelmsLocked) {
                this.globals.player1Ship.x = evt.clientX;
                this.globals.player1Ship.y = evt.clientY;
                this.ws.publish("moveShip", {
                    x: this.globals.player1Ship.x,
                    y: this.globals.player1Ship.y,
                    id: ""
                });
            }
        }
        // window.style.cursor = 'none';
        // } else {
        //     window.style.cursor = 'auto';
        // }
    };

    engine.update = update;

}(engine));
