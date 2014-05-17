var engine;
(function(engine) {
    var update = (function(core) {

        function update(core) {
            this.core = core;
        }
        return update;
    }());

    update.prototype.updateBonus = function(data) {
        if (IsGameStarted) {
            //this.core.globals.bonusArr = data;
            var i;
            for (i = 0; i < data.bonusim.length; i++) {
                this.core.globals.bonusArr[i] = new bonusItem();
                this.core.globals.bonusArr[i].x = data.bonusim[i].x;
                this.core.globals.bonusArr[i].y = data.bonusim[i].y;
                this.core.globals.bonusArr[i].timeout = data.bonusim[i].timeout;
                this.core.globals.bonusArr[i].value = data.bonusim[i].value;
                this.core.globals.bonusArr[i].type = data.bonusim[i].type;
                this.core.globals.bonusArr[i].effectDuration = data.bonusim[i].effectDuration;
                this.core.globals.bonusArr[i].width = imageBonus.width;
                this.core.globals.bonusArr[i].height = imageBonus.height;
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
                        if (this.core.globals.scorePlayer1 > 500) {
                            this.core.globals.scorePlayer1 -= 500;
                        } else {
                            this.core.globals.scorePlayer1 = 0;
                        }
                        break;
                    case 2:
                        if (this.core.globals.scorePlayer2 > 500) {
                            this.core.globals.scorePlayer2 -= 500;
                        } else {
                            this.core.globals.scorePlayer2 = 0;
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
        if (!this.core.globals.player1Ship.isHit && !this.core.globals.player1Ship.shieldsUp) {
             var shipCenter = getCenterPoint(this.core.globals.player1Ship);

            var wingManCenter = getCenterPoint(this.core.globals.player2Ship);
            
            for (i = 0; i < this.core.globals.rocksArr.length; ++i) {
                rockCenter = getCenterPoint(this.core.globals.rocksArr[i]);
                deltax = shipCenter.x - rockCenter.x;
                deltay = shipCenter.y - rockCenter.y;
                dist = Math.sqrt(deltax * deltax + deltay * deltay);
                if (dist < 30) {
                    this.updateScore(1, "hit");
                    this.core.globals.player1Ship.explode(i);
                }
            }
            if (!this.core.globals.isHelmsLocked) {
                deltax = shipCenter.x - this.core.globals.player2Ship.x;
                deltay = shipCenter.y - this.core.globals.player2Ship.y;
                dist = Math.sqrt(deltax * deltax + deltay * deltay);
                if (dist < 30) {
                    isHelmsLocked = true;
                    //updateSthis.core(1, "hit");
                    console.log("player collide");
                    if (this.core.globals.player1Ship.x > this.core.globals.player2Ship.x) {
                        effect = new bumpEffect(true);
                        this.core.globals.player1Ship.isUnderEffect = true;
                        this.core.globals.player1Ship.fx = effect;
                        weffect = new bumpEffect(false);
                        this.core.globals.player2Ship.isUnderEffect = true;
                        this.core.globals.player2Ship.fx = weffect;
                    } else {
                        effect = new bumpEffect(false);
                        this.core.globals.player1Ship.isUnderEffect = true;
                        this.core.globals.player1Ship.fx = effect;
                        weffect = new bumpEffect(true);
                        this.core.globals.player2Ship.isUnderEffect = true;
                        this.core.globals.player2Ship.fx = weffect;
                    }
                    //this.core.globals.player1Ship.explode(i);
                }
            }
        }

        for (i = 0; i < this.core.globals.bonusArr.length; ++i) {
            if (this.core.globals.bonusArr[i].timeout > 0) {
                center = getCenterPoint(this.core.globals.bonusArr[i]);

                // chekc if bonusItem is Taken
                if (center.x >= this.core.globals.player1Ship.x - 10 && center.x <= this.core.globals.player1Ship.x + 70) {
                    if (center.y + 25 >= this.core.globals.player1Ship.y + 10 && center.y + 25 <= this.core.globals.player1Ship.y + 80) {
                        this.core.globals.bonusArr[i].timeout = 0;
                        if (this.core.globals.bonusArr[i].type == 0) {
                            this.updateScore(1, "bonus");
                            console.log("points");
                        } else switch (this.core.globals.bonusArr[i].type) {
                            case 1:
                                if (this.core.globals.player1Ship.fx) {
                                    this.core.globals.player1Ship.fx.clearFX(this.core.globals.player1Ship);
                                }

                                this.core.globals.player1Ship.isUnderEffect = true;
                                effect = new shieldsEffect();
                                this.core.globals.player1Ship.fx = effect;
                                onScreenText = "Shields Up!";
                                break;
                            case 2:
                                if (this.core.globals.player1Ship.fx) {
                                    this.core.globals.player1Ship.fx.clearFX(this.core.globals.player1Ship);
                                }
                                this.core.globals.player1Ship.isUnderEffect = true;
                                effect = new shrinkEffect(32);
                                this.core.globals.player1Ship.fx = effect;
                                onScreenText = "Shrink Ray!";
                                break;
                            case 3:

                                if (this.core.globals.player1Ship.fx) {
                                    this.core.globals.player1Ship.fx.clearFX(this.core.globals.player1Ship);
                                }
                                this.core.globals.player1Ship.isUnderEffect = true;
                                effect = new drunkEffect(3);
                                this.core.globals.player1Ship.fx = effect;
                                onScreenText = "Drunk Driving!";
                                break;
                        }
                        ws.publish.playerTakesBonus(this.core.globals.bonusArr[i].type, i);
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
