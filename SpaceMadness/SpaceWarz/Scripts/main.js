//#region Game Loading

var engine,core;

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setInterval(engine.core.gameLoop, engine.core.globals.FPS);
        };
}());

window.onload = function () {


    core = new engine.core();

    var queryValues = getUrlVars();
    core.globals.userId = queryValues["userId"];
    core.globals.roomId = queryValues["roomId"];

    if (window.hasOwnProperty('prompt')) {
        delete window.prompt;
    }
    if (core.globals.userId == null)
        core.globals.userId = window.prompt("enterName", "guest");

    //#region init variables

    core.startEngine();

    if (window.addEventListener) {
        core.globals.canvas.addEventListener('mousemove', mouseMove, false);
        window.addEventListener('keydown', whatKey, false);
    } else if (window.attachEvent) {
        core.globals.canvas.attachEvent('onmousemove', mouseMove);
        window.attachEvent('onkeydown', whatKey);
    }





    //in Debug Mode
    if (roomId == null) {
        console.log("Debug");
        roomId = "r1 ";
    }



    core.hub.client.shipMoved = function (x, y, id) {
        if (IsGameStarted) {
            core.globals.player2Ship.x = x;
            core.globals.player2Ship.y = y;
        }
    };

    core.hub.client.setRockData = function (data) {
        core.globals.rocksArr[data.Index] = new spaceRock(data.X, data.Y,data.Speed,data.Angle,data.RotationSpeed,data.Width,data.Height);
    };

    core.hub.client.setRockArray = function (data) {
        for (var i = 0; i < data.length; i++) {
            rcore.globals.rocksArr[i] = new spaceRock(data.X, data.Y, data.Speed, data.Angle, data.RotationSpeed, data.Width, data.Height);
           
        }
    };

    core.hub.client.setBonusData = function (data) {
        var now = moment().format('h:mm:ss');
        updateBonus(data);
    }

    core.hub.client.wingManExplode = function (data) {
        if (IsGameStarted) {
            wingcore.globals.player2ShipMan.takeHit();
            updateScore(2, "hit");
        }
    }

    core.hub.client.startGame = function (playerIndex) {
        switch (playerIndex) {
            case 1:
                // core.globals.player1Ship.image.src = 'Images/spaceship1.png'
                core.player1Ship.image.src = 'Images/New ship/tmp-35.gif'
                core.player2Ship.image.src = 'Images/spaceship2.png'
                core.player1Ship.Transform = true;
                core.player1Ship.frameIndex = 0;

                break;
            case 2:
                core.player1Ship.image.src = 'Images/spaceship2.png'
                core.player2Ship.image.src = 'Images/spaceship1.png'
                core.player1Ship.x = core.player2Ship.x;
                core.player1Ship.y = core.player2Ship.y;
                core.player2Ship.x = core.player1Ship.oldX;
                core.player2Ship.y = core.player1Ship.oldY;

                break;

        }
        showMessage("Click 'Esc' to exit the room !!!");
        backGroundSpeed = 2;
        core.hub.server.initRockArray();
        core.gameLoop();
    }

    core.hub.client.playerWait = function () {
        showMessage("Wait for another player to arrive ...");
        drawBackround();
        drawScores();
        drawLifeBar(core.globals.player1Ship.damageBar, 1);
        drawLifeBar(wingMan.damageBar, 2);
        drawPlayer(core.globals.player1Ship);
        drawPlayer(wingMan);
    }

    core.hub.client.redirectToLobby = function (urlTarget, msg) {
        showMessage(msg);
        FPS = 0;
        window.location = urlTarget;
    };

    core.hub.client.playerTakeBonus = function (type, bonusIndex) {
        bonusArr[bonusIndex].timeout = 0;
        switch (type) {
            case 0:
                updateScore(2, "bonus");
                break;
            case 1:
                if (wingMan.fx)
                    wingMan.fx.clearFX(wingMan);
                wingMan.isUnderEffect = true;
                var effect = new shieldsEffect();
                wingMan.fx = effect;
                break;
            case 2:
                if (wingMan.fx)
                    wingMan.fx.clearFX(wingMan);
                wingMan.isUnderEffect = true;
                var effect = new shrinkEffect(32);
                wingMan.fx = effect;
                break;
            case 3:
                if (wingMan.fx)
                    wingMan.fx.clearFX(wingMan);
                wingMan.isUnderEffect = true;
                var effect = new drunkEffect();
                wingMan.fx = effect;
                break;
        }
    }

    core.hub.client.wingmanBump = function () {
        var effect = new bumpEffect(false);
        core.globals.player1Ship.fx = effect;
        core.globals.player1Ship.isUnderEffect = true;
        console.log("bumped");
    }
    //#endregion
}

core.globals.imageObjBackground.onload = function () {
    // draw background and both players
    core.globals.context.drawImage(core.globals.imageObjBackground, 0, 0);
    core.globals.context.drawImage(core.globals.player2Ship.image, core.globals.player2Ship.x, core.globals.player2Ship.y);
    core.globals.context.drawImage(core.globals.player1Ship.image, core.globals.player1Ship.x, core.globals.player1Ship.y);
};

//#endregion

//#region Draw

function drawBackround() {
    core.context.clearRect(0, 0, core.globals.canvas.width, core.globals.canvas.height);
    core.context.drawImage(imageObjBackground, 0, backgroundVelocity);
    core.context.drawImage(imageObjBackground, 0, (-1 * (core.globals.imageObjBackground.height - core.globals.backgroundVelocity)));
    if (core.globals.backgroundVelocity > core.globals.imageObjBackground.height) {
        core.globals.backgroundVelocity = 0;
    }
    core.globals.backgroundVelocity += core.globals.backGroundSpeed;
}

function drawLifeBar(minLifeBar, playerIndex) {
    var y = 100 + minLifeBar;
    //draw bar Frame
    core.globals.context.beginPath();
    if (playerIndex === 1) {
        core.globals.context.moveTo(10, 100);
        core.globals.context.lineTo(10, 490);
        core.globals.context.lineTo(30, 490);
        core.globals.context.lineTo(30, 100);
        core.globals.context.lineTo(10, 100);
    } else {
        core.globals.context.moveTo(870, 100);
        core.globals.context.lineTo(870, 490);
        core.globals.context.lineTo(890, 490);
        core.globals.context.lineTo(890, 100);
        core.globals.context.lineTo(870, 100);
    }
    core.globals.context.closePath();
    core.globals.context.lineWidth = 5;
    core.globals.context.strokeStyle = 'blue';
    core.globals.context.stroke();

    //draw life bar
    core.globals.context.beginPath();
    if (playerIndex === 1) {
        core.globals.context.moveTo(11, y); //start
        core.globals.context.lineTo(11, 489); //left
        core.globals.context.lineTo(29, 489); //footer
        core.globals.context.lineTo(29, y); //right
        core.globals.context.lineTo(11, y); //head
    } else {
        core.globals.context.moveTo(871, y); //start
        core.globals.context.lineTo(871, 489); //left
        core.globals.context.lineTo(889, 489); //footer
        core.globals.context.lineTo(889, y); //right
        core.globals.context.lineTo(871, y); //head
    }

    core.globals.context.fillStyle = "rgba(255,0,0,0.5)";
    core.globals.context.fill();
    core.globals.context.closePath();
}

function drawPlayer(ship) {
    if (ship.isHit) {
        drawExplosion(ship);
    } else {
        core.globals.context.drawImage(ship.image, ship.x, ship.y, ship.width, ship.height);
    }
    if (ship.Transform) {

        drawShipTransform(ship);

    }
}

function drawScores() {
    core.globals.context.fillStyle = "rgba(255,0,0,0.5)";
    core.globals.context.font = 'italic bold 30px sans-serif';
    core.globals.context.textBaseline = 'bottom';
    core.globals.context.fillText(scorePlayer1, 60, 35);
    core.globals.context.fillText(scorePlayer2, 780, 35);
}

function drawTimer(value) {
    // draw background and both players
    core.globals.context.clearRect(0, 0, canvas.width, canvas.height);
    core.globals.context.drawImage(imageObjBackground, 0, 0);
    drawLifeBar(core.globals.player1Ship.damageBar, 1);
    drawLifeBar(wingMan.damageBar, 2);
    drawPlayer(core.globals.player1Ship);
    drawPlayer(wingMan);
    core.globals.context.fillStyle = "rgba(255,0,0,0.5)";
    core.globals.context.font = 'italic bold 70px sans-serif';
    core.globals.context.textBaseline = 'bottom';
    core.globals.context.fillText(value, 430, 280);
}

function drawBonus() {
    $.each(bonusArr, function (index, bonusItem) {
        if (bonusItem.timeout > 0) {
            core.globals.context.drawImage(imageBonus, bonusItem.x, bonusItem.y);
            bonusItem.timeout--;
        }
    });
}

function drawRocks() {
    for (var i = 0; i < rocksArr.length; ++i) {
        drawRotatedImage(imageRock, rocksArr[i].x, rocksArr[i].y, rocksArr[i].angle, rocksArr[i].width, rocksArr[i].height);
        rocksArr[i].angle += rocksArr[i].rotationSpeed;
        if (rocksArr[i].y > 500) {
            hub.server.initRock(i);
        } else {
            rocksArr[i].y = rocksArr[i].y + rocksArr[i].speed;
        }
    }
}

function drawExplosion(ship) {
    if (ship.frameIndex < explosionArray.length) {
        core.globals.context.drawImage(explosionArray[ship.frameIndex].image, ship.x - 30, ship.y - 30);
        ship.frameIndex++;
    } else {
        ship.isHit = false;
    }
}

function drawShipTransform(ship) {
    if (ship.frameIndex < shipTransform.length) {
        core.globals.context.drawImage(shipTransform[ship.frameIndex].image, ship.x, ship.y, 120, 120);
        ship.frameIndex++;
    } else {
        ship.Transform = false;
    }
}

function drawText(txt) {
    core.globals.context.fillStyle = "rgba(255,0,0,0.5)";
    core.globals.context.font = 'italic bold 35px sans-serif';
    core.globals.context.textBaseline = 'bottom';
    core.globals.context.fillText(txt, canvas.clientWidth / 2, 50);
}

function drawRotatedImage(image, x, y, angle, width, height) {

    // save the current co-ordinate system 
    // before we screw with it
    core.globals.context.save();

    // move to the middle of where we want to draw our image
    core.globals.context.translate(x, y);

    // rotate around that point, converting our 
    // angle from degrees to radians 
    core.globals.context.rotate(angle * TO_RADIANS);

    // draw it up and to the left by half the width
    // and height of the image 
    core.globals.context.drawImage(image, -(image.width / 2), -(image.height / 2), width, height);

    // and restore the co-ords to how they were when we began
    core.globals.context.restore();
}
//#endregion

//#region Update

function updateBonus(data) {
    if (IsGameStarted) {
        //bonusArr = data;
        for (var i = 0; i < data.bonusim.length; i++) {
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
}

function updateScore(playerIndex, updateType) {
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
                    if (scorePlayer1 > 500) {
                        scorePlayer1 -= 500;
                    } else scorePlayer1 = 0
                    break;
                case 2:
                    if (scorePlayer2 > 500)
                        scorePlayer2 -= 500;
                    else scorePlayer2 = 0
                    break;
            }
            break;
    }
}

function updateBonusEffect(ship) {
    if (ship.isUnderEffect) {
        ship.applyEffect();
    }
}

function checkColision() { //make more generic collidable interface;

    if (!core.globals.player1Ship.isHit && !core.globals.player1Ship.shieldsUp) {
        var shipCenter = getCenterPoint(core.globals.player1Ship)
        var wingManCenter = getCenterPoint(wingMan);
        for (var i = 0; i < rocksArr.length; ++i) {
            var rockCenter = getCenterPoint(rocksArr[i]);
            var deltax = shipCenter.x - rockCenter.x;
            var deltay = shipCenter.y - rockCenter.y;
            var dist = Math.sqrt(deltax * deltax + deltay * deltay);
            if (dist < 30) {
                updateScore(1, "hit");
                core.globals.player1Ship.explode(i);
            }
        }
        if (!isHelmsLocked) {
            var deltax = shipCenter.x - wingManCenter.x;
            var deltay = shipCenter.y - wingManCenter.y;
            var dist = Math.sqrt(deltax * deltax + deltay * deltay);
            if (dist < 30) {
                isHelmsLocked = true;
                //updateScore(1, "hit");
                console.log("player collide");
                if (core.globals.player1Ship.x > wingMan.x) {
                    var effect = new bumpEffect(true);
                    core.globals.player1Ship.isUnderEffect = true;
                    core.globals.player1Ship.fx = effect;
                    var weffect = new bumpEffect(false);
                    wingMan.isUnderEffect = true;
                    wingMan.fx = weffect;
                } else {
                    var effect = new bumpEffect(false);
                    core.globals.player1Ship.isUnderEffect = true;
                    core.globals.player1Ship.fx = effect;
                    var weffect = new bumpEffect(true);
                    wingMan.isUnderEffect = true;
                    wingMan.fx = weffect;
                }
                //core.globals.player1Ship.explode(i);
            }
        }
    }


    for (var i = 0; i < bonusArr.length; ++i) {
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
                            if (core.globals.player1Ship.fx)
                                core.globals.player1Ship.fx.clearFX(core.globals.player1Ship);
                            core.globals.player1Ship.isUnderEffect = true;
                            var effect = new shieldsEffect();
                            core.globals.player1Ship.fx = effect;
                            onScreenText = "Shields Up!";
                            break;
                        case 2:
                            if (core.globals.player1Ship.fx)
                                core.globals.player1Ship.fx.clearFX(core.globals.player1Ship);
                            core.globals.player1Ship.isUnderEffect = true;
                            var effect = new shrinkEffect(32);
                            core.globals.player1Ship.fx = effect;
                            onScreenText = "Shrink Ray!";
                            break;
                        case 3:
                            if (core.globals.player1Ship.fx)
                                core.globals.player1Ship.fx.clearFX(core.globals.player1Ship);
                            core.globals.player1Ship.isUnderEffect = true;
                            var effect = new drunkEffect(3);
                            core.globals.player1Ship.fx = effect;
                            onScreenText = "Drunk Driving!";
                            break;
                    }
                    hub.server.playerTakesBonus(bonusArr[i].type, i);
                }
            }
        }
    }
}

function whatKey(evt) {
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
        } else hub.server.moveShip(core.globals.player1Ship.x, core.globals.player1Ship.y, "");
    }
}

function mouseMove(evt) {
    if ((evt.clientX < backGroundX && evt.clientY < backGroundY) && (evt.clientX > 0 && evt.clientY > 0)) {
        evt.preventDefault();
        if (!core.globals.player1Ship.isHit && IsGameStarted && !isHelmsLocked) {
            core.globals.player1Ship.x = evt.clientX;
            core.globals.player1Ship.y = evt.clientY;
            hub.server.moveShip(core.globals.player1Ship.x, core.globals.player1Ship.y, "");
        }
        this.style.cursor = 'none';
    } else {
        this.style.cursor = 'auto';
    }
}
//#endregion

//#region Utils
// Read a page's GET URL variables and return them as an associative array.

function getUrlVars() {
    var vars = [],
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function getCenterPoint(object) {
    return {
        x: Math.round(object.x + object.width / 2),
        y: Math.round(object.y + object.height / 2)
    };
}

function showMessage(message) {
    $("#ClientMessages").text(message).show();
}

//#endregion
