/// <reference path="Scripts/jquery.d.ts" />
/// <reference path="Scripts/signalr.d.ts" />
/// <reference path="TypeScript/Effects/effectBase.ts" />
/// <reference path="TypeScript/Effects/shrinkFx.ts" />
/// <reference path="TypeScript/Effects/shieldFx.ts" />
/// <reference path="TypeScript/Effects/drunkFx.ts" />
/// <reference path="TypeScript/Effects/bumpFX.ts" />
/// <reference path="TypeScript/bonusItem.ts" />
/// <reference path="TypeScript/spaceRock.ts" />
/// <reference path="TypeScript/spaceShip.ts" />
//#region variables
//#region Globals
var canvas;
var context;
var hub;
var bar;

var imageObjBackground = new Image();
var imageRock = new Image();
var imageBonus = new Image();
var DEBUG = false;
var SCOREBONUS = 1000;
var HIT_VALUE = 500;
var collidables;

//var myShipImageUrl = 'Images/New ship/tmp-35.gif';
var myShipImageUrl = 'Images/spaceship1.png';
var wingManImageUrl = 'Images/spaceship2.png';
var rockImageUrl = "Images/asteroid.png";
var backgroundImageUrl = "Images/space_background.jpg";
var bonusImageUrl = "Images/bonus1.png";

// background value's
var backgroundVelocity = 0;
var backGroundX = 840;
var backGroundY = 440;

var Damage_MAX = 420;
var Hit_Damage = 35;

var frameCounter = 0;
var explosionArray = [];
var shipTransform = [];
var bonusArr;
var rocksArr;

// value's for rotate the rock's
var TO_RADIANS = Math.PI / 180;

var myShip, wingMan;

var CountdownTimer = 1;
var IsGameStarted = false;
var isReadyToExit = false;

var qs = {
    'roomId': "",
    'userId': ""
};

var player1Score = {
    x: 60,
    y: 35,
    value: 0
};

var player2Score = {
    x: 750,
    y: 35,
    value: 0
};

var FPS = 0;
var backGroundProgress = 0;

//#endregion
//#endregion
//#region Game Loading
window.onload = function () {
    window.requestAnimationFrame = (function () {
        return window.requestAnimationFrame;
    })();

    var queryValues = getUrlVars();
    qs['userId'] = queryValues["userId"];
    qs['roomId'] = queryValues["roomId"];

    if (window.hasOwnProperty('prompt')) {
        delete window.prompt;
    }

    if (qs['userId'] == null)
        qs['userId'] = window.prompt("enterName", "guest");

    //#region init variables
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');

    if (window.addEventListener) {
        canvas.addEventListener('mousemove', mouseMove, false);
        window.addEventListener('keydown', whatKey, false);
    } else if (window.attachEvent) {
        canvas.attachEvent('onmousemove', mouseMove);
        window.attachEvent('onkeydown', whatKey);
    }

    imageRock.src = rockImageUrl;
    imageObjBackground.src = backgroundImageUrl;
    imageBonus.src = bonusImageUrl;

    // Player 1
    myShip = new spaceShip("myShip", myShipImageUrl, 200, 430);

    // Player 2
    wingMan = new spaceShip("wingMan", wingManImageUrl, 700, 430);

    //bonusArr = new bonusItem[];
    //rocksArr = new spaceRock[];
    var j = 0;
    for (var i = 0; i < 7 * 5; i++) {
        explosionArray[i] = {
            image: new Image()
        };

        explosionArray[i].image.src = "Images/Frames/e" + (j + 1) + ".png";
        if (i % 5 === 0) {
            j++;
        }
    }

    var k = 0;
    for (var i = 0; i < 35 * 4; i++) {
        shipTransform[i] = {
            image: new Image()
        };

        shipTransform[i].image.src = "Images/New ship/tmp-" + k + ".gif";
        if (i % 4 === 0) {
            k++;
        }
    }

    if (qs['roomId'] == null) {
        qs['roomId'] = "r1 ";
    }

    $.connection.hub.qs = qs;
    hub = $.connection.spaceHub;

    //#endregion
    //#region client Methods
    //#region wingMan
    hub.client.wingManMove = function (x, y, id) {
        if (IsGameStarted) {
            wingMan.x = x;
            wingMan.y = y;
        }
    };

    hub.client.wingManExplode = function (data) {
        if (IsGameStarted) {
            wingMan.takeHit();
            updateScore(2, "hit");
        }
    };

    hub.client.wingmanTakeBonus = function (name, i) {
        collidables[i].timeout = 0;
        wingMan.isUnderEffect = true;
        if (wingMan.fx)
            wingMan.fx.clearFX(wingMan);

        switch (collidables[i].name) {
            case 0:
                wingMan.isUnderEffect = false;
                updateScore(1, "bonus");
                console.log("points");
                break;
            case 1:
                wingMan.fx = new effects.shieldFx(wingMan);
                break;
            case 2:
                wingMan.fx = new effects.shrinkFx(wingMan);
                break;
            case 3:
                wingMan.fx = new effects.drunkFx(wingMan, 20);
                break;
        }
    };

    hub.client.wingmanBump = function (hitter) {
        myShip.fx = new effects.bumpFX(myShip, hitter);
        myShip.isUnderEffect = true;
        console.log("bumped");
    };

    //#endregion
    //#region Rocks
    hub.client.setRockData = function (rock) {
        rocksArr[rock.index] = new spaceRock(rock);
    };

    hub.client.setRockArray = function (rocks) {
        if (rocksArr == null)
            rocksArr = new Array();
        rocksArr = rocks;
    };

    hub.client.addRock = function (rock) {
        if (rocksArr.length < 20)
            rocksArr.push(rock);
        if (DEBUG)
            console.log("rockAdded - Array Length : ", rocksArr.length);
    };

    //#endregion
    //#region init Game
    $.connection.hub.start().done(function () {
        // $.connection.hub.logging = true;
        console.log(qs);
        $.ajax('http://localhost:49950/Lobby/RegisterPlayerName', {
            success: function () {
                console.log("success");
            },
            error: function (xhr) {
                console.log(xhr.statusText);
            },
            data: { userId: qs.userId },
            dataType: 'json',
            type: 'POST',
            async: true
        });
    });

    hub.client.startGame = function (playerIndex) {
        //if u are the "wingMan"
        if (playerIndex == 2) {
            var swapShip = wingMan;
            wingMan = myShip;
            myShip = swapShip;

            //myShip.id = "myShip";
            //wingMan.id = "wingMan";
            player1Score.x = player1Score.x + player2Score.x;
            player2Score.x = player1Score.x - player2Score.x;
            player1Score.x = player1Score.x - player2Score.x;

            FPS = 1000 / 60;
            backGroundProgress = 2;
            hub.server.initRockArray(qs.roomId);
        }
        showMessage("Click 'Esc' to exit the room !!!");
        gameLoop();
    };

    hub.client.playerWait = function () {
        showMessage("Wait for another player to arrive ...");
        drawBackground();
        drawScores();
        drawLifeBar(myShip);
        drawLifeBar(wingMan);
        drawPlayer(myShip);
        drawPlayer(wingMan);
    };

    hub.client.redirectToLobby = function (urlTarget, msg) {
        showMessage(msg);
        FPS = 0;
        var target = urlTarget + "?" + qs.userId + ":" + player1Score.value;

        // window.location = urlTarget;
        $.ajax(urlTarget, {
            success: function () {
                console.log("success");
            },
            error: function (xhr) {
                console.log(xhr.statusText);
            },
            data: { roomId: qs.roomId, score: player1Score.value },
            dataType: 'json'
        });
    };

    //#endregion
    hub.client.setBonusData = function (data) {
        if (data != null) {
            if (DEBUG) {
                console.log("server bonus payload : ", data.length);
            }
            if (bonusArr == null)
                bonusArr = new Array();
            for (var i = 0; i < data.length; i++) {
                bonusArr[i] = new bonusItem(data[i]);
            }
        }
    };
};

imageObjBackground.onload = function () {
    context.drawImage(imageObjBackground, 0, 0);
};

//#endregion
//#region GameLoop
function gameLoop() {
    frameCounter++;
    if (!IsGameStarted) {
        //                             *possible BUG*
        if (frameCounter % 60 == 0 && frameCounter < 420) {
            drawTimer(CountdownTimer);
        }
    } else {
        //TODO: tidie up
        if (myShip.life == 0) {
            canvas.textContent = "GameOver";
            myShip.isHelmsLocked = true;
            drawBackground();
            drawScores();
            drawExtraLife(wingMan);
            drawRocks();
            drawBonus();
            drawLifeBar(myShip);
            drawLifeBar(wingMan);
            drawPlayer(myShip);
            drawPlayer(wingMan);
            drawText(canvas.textContent, canvas.clientWidth / 2 - 100, canvas.clientHeight / 2);
            updateBonus();
            updateBonusEffect(wingMan);
        } else {
            player1Score.value++;
            player2Score.value++;
            drawBackground();
            drawScores();
            drawExtraLife(wingMan);
            drawExtraLife(myShip);
            drawRocks();
            drawBonus();
            drawLifeBar(myShip);
            drawLifeBar(wingMan);
            drawPlayer(myShip);
            drawPlayer(wingMan);
            drawText(canvas.textContent, canvas.clientWidth / 2 - 100, canvas.clientHeight / 2);

            checkColision();

            updateBonus();
            updateBonusEffect(wingMan);
            updateBonusEffect(myShip);
        }
    }
    window.requestAnimationFrame(gameLoop);
}

//#endregion
//#region Draw
function drawBackground() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(imageObjBackground, 0, backgroundVelocity);
    if (DEBUG) {
        context.drawImage(imageObjBackground, 0, (-1 * (imageObjBackground.height - backgroundVelocity)));

        if (backgroundVelocity > imageObjBackground.height) {
            backgroundVelocity = 0;
        }

        //increase Speed
        if (frameCounter % 1200 == 0 && backGroundProgress < 10) {
            backGroundProgress += 2;
        }
        backgroundVelocity += backGroundProgress;
    }

    if (DEBUG) {
        for (var j = 50; j < 900; j += 50) {
            context.beginPath();
            context.moveTo(j, 0);
            context.lineTo(j, 490);
            context.closePath();
            context.lineWidth = 2;
            context.strokeStyle = 'rgba(255,0,0,0.2)';
            context.stroke();
        }

        for (var v = 50; v < 550; v += 50) {
            context.beginPath();
            context.moveTo(0, v);
            context.lineTo(900, v);
            context.closePath();
            context.lineWidth = 2;
            context.strokeStyle = 'rgba(255,0,0,0.2)';
            context.stroke();
        }
    }
}
;

function drawLifeBar(ship) {
    var y = 100 + ship.damageBar;

    //draw bar Frame
    context.beginPath();
    if (ship.id == "myShip") {
        context.moveTo(10, 100);
        context.lineTo(10, 490);
        context.lineTo(30, 490);
        context.lineTo(30, 100);
        context.lineTo(10, 100);
    } else {
        context.moveTo(870, 100);
        context.lineTo(870, 490);
        context.lineTo(890, 490);
        context.lineTo(890, 100);
        context.lineTo(870, 100);
    }
    context.closePath();
    context.lineWidth = 5;
    context.strokeStyle = 'blue';
    context.stroke();

    //draw life bar
    context.beginPath();
    if (ship.id == "myShip") {
        context.moveTo(11, y); //start
        context.lineTo(11, 489); //left
        context.lineTo(29, 489); //footer
        context.lineTo(29, y); //right
        context.lineTo(11, y); //head
    } else {
        context.moveTo(871, y); //start
        context.lineTo(871, 489); //left
        context.lineTo(889, 489); //footer
        context.lineTo(889, y); //right
        context.lineTo(871, y); //head
    }

    context.fillStyle = "rgba(255,0,0,0.5)";
    context.fill();
    context.closePath();
}
;

function drawPlayer(ship) {
    if (ship.isHit) {
        drawExplosion(ship);
    } else {
        context.drawImage(ship.image, ship.x, ship.y, ship.width, ship.height);

        if (DEBUG) {
            //draw hit area
            var center = getCenterPoint(ship);
            context.beginPath();
            context.arc(center.x, center.y, (ship.width / 2) + 3, 0, 2 * Math.PI, false);
            context.fillStyle = "rgba(125,255,125,0.5)";
            context.closePath();
            context.fill();

            //draw center
            context.beginPath();
            context.arc(center.x, center.y, 3, 0, 2 * Math.PI, false);
            context.fillStyle = "rgba(255,0,0,1.5)";
            context.closePath();
            context.fill();

            //draw x,y
            context.beginPath();
            context.fillStyle = "rgba(255,255,255,1.5)";
            context.font = 'italic bold 15px sans-serif';
            context.textBaseline = 'center';
            context.fillText(ship.x + "," + ship.y, ship.x + 50, ship.y);
            context.closePath();
            context.fill();
        }
    }
    if (ship.Transform) {
        //drawShipTransform(ship);
    }
}
;

function drawScores() {
    context.fillStyle = "rgba(255,0,0,0.5)";
    context.font = 'italic bold 30px sans-serif';
    context.textBaseline = 'bottom';
    context.fillText(player1Score.value, player1Score.x, player1Score.y);
    context.fillText(player2Score.value, player2Score.x, player2Score.y);
}
;

function drawTimer(value) {
    // draw background and both players
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(imageObjBackground, 0, 0);
    drawLifeBar(myShip);
    drawLifeBar(wingMan);
    drawPlayer(myShip);
    drawPlayer(wingMan);
    context.fillStyle = "rgba(255,0,0,0.5)";
    context.font = 'italic bold 70px sans-serif';
    context.textBaseline = 'bottom';
    context.fillText(value, 430, 280);
    CountdownTimer--;
    if (CountdownTimer < 0)
        IsGameStarted = true;
}
;

function drawBonus() {
    if (bonusArr != null) {
        $.each(bonusArr, function (index, bonusItem) {
            context.drawImage(imageBonus, bonusItem.x, bonusItem.y);
            if (DEBUG) {
                var center = getCenterPoint(bonusItem);
                context.beginPath();
                context.fillStyle = "rgba(255,255,255,1.5)";
                context.font = 'italic bold ' + 15 + 'px sans-serif';
                context.textBaseline = 'center';
                context.fillText(index, bonusItem.x, bonusItem.y);
                context.fill();
                context.closePath();
            }
        });
    }
}
;

function drawRocks() {
    for (var i = 0; i < rocksArr.length; ++i) {
        drawRotatedImage(rocksArr[i]);
        rocksArr[i].angle += rocksArr[i].rotationSpeed;

        if (DEBUG) {
            //draw hit area
            context.beginPath();
            context.arc(rocksArr[i].x, rocksArr[i].y, (rocksArr[i].width / 2) - 3, 0, 2 * Math.PI, false);
            context.fillStyle = "rgba(255,255,0,0.2)";
            context.closePath();
            context.fill();

            //draw center
            context.beginPath();
            context.arc(rocksArr[i].x, rocksArr[i].y, 3, 0, 2 * Math.PI, false);
            context.fillStyle = "rgba(255,0,0,1.5)";
            context.closePath();
            context.fill();

            //draw distance
            if (myShip.life > 0) {
                context.beginPath();
                context.fillStyle = "rgba(255,255,255,1.5)";
                context.font = 'italic bold ' + 15 + 'px sans-serif';
                context.textBaseline = 'center';
                context.fillText(rocksArr[i].distance, rocksArr[i].x - 40, rocksArr[i].y + 10);
                context.closePath();
                context.fill();
            }

            //draw X,Y
            context.beginPath();
            context.fillStyle = "rgba(255,255,255,1.5)";
            context.font = 'italic bold 15px sans-serif';
            context.textBaseline = 'center';
            context.fillText(rocksArr[i].x + "," + rocksArr[i].y, rocksArr[i].x + 20, rocksArr[i].y - 10);
            context.closePath();
            context.fill();
        }

        if (rocksArr[i].y > 550)
            hub.server.initRock(i, qs.roomId);
        else
            rocksArr[i].y = rocksArr[i].y + rocksArr[i].speed;
    }
}
;

function drawExplosion(ship) {
    if (ship.isDead)
        drawDeathExplosion(ship);
    else {
        if (ship.frameIndex < explosionArray.length) {
            context.drawImage(ship.image, ship.x, ship.y, ship.width, ship.height);
            context.drawImage(explosionArray[ship.frameIndex].image, ship.x, ship.y + 10, 60, 60);

            ship.frameIndex++;
        } else {
            ship.isHit = false;
        }
    }
}
;

function drawDeathExplosion(ship) {
    if (ship.frameIndex < explosionArray.length) {
        context.drawImage(explosionArray[ship.frameIndex].image, ship.x, ship.y);
        ship.frameIndex++;
    } else {
        ship.isHit = false;
        ship.isDead = false;
    }
}
;

function drawText(txt, x, y) {
    context.fillStyle = "rgba(255,0,0,0.3)";
    context.font = 'italic bold 35px sans-serif';
    context.textBaseline = 'bottom';
    context.fillText(txt, x, y);
}
;

function drawRotatedImage(rock) {
    context.save();

    //move to the middle of where we want to draw our image
    context.translate(rock.x, rock.y);

    //rotate around that point, converting our
    //angle from degrees to radians
    context.rotate(rock.angle * TO_RADIANS);

    //draw it up and to the left by half the width
    // and height of the image
    context.drawImage(imageRock, -(rock.width / 2), -(rock.height / 2), rock.width, rock.height);

    // and restore the co-ords to how they were when we began
    context.restore();
}
;

function drawExtraLife(ship) {
    switch (ship.id) {
        case "myShip":
            var initLoc = 160;
            for (var i = 0; i < ship.life; i++) {
                context.drawImage(ship.image, initLoc, 10, 30, 30);
                initLoc += 40;
            }
            break;
        case "wingMan":
            var initLoc = 620;
            for (var i = 0; i < ship.life; i++) {
                context.drawImage(ship.image, initLoc, 10, 30, 30);
                initLoc += 40;
            }
            break;
    }
}
;

//#endregion
//#region Update
function checkColision() {
    collidables = rocksArr;

    if (bonusArr)
        collidables = collidables.concat(bonusArr);

    collidables = collidables.concat(wingMan);

    if (!myShip.isDead && myShip.life > 0) {
        var shipCenter = getCenterPoint(myShip);

        for (var i = 0; i < collidables.length; ++i) {
            //var collidableCenter = getCenterPoint(collidables[i]);
            //var deltax = shipCenter.x - collidableCenter.x;
            //var deltay = shipCenter.y - collidableCenter.y;
            //compute distance from ship
            var deltax = shipCenter.x - collidables[i].x;
            var deltay = shipCenter.y - collidables[i].y;
            var dist = Math.round(Math.sqrt((deltax * deltax) + (deltay * deltay)));
            var radius = collidables[i].width / 2;
            var buffer = 13;

            if (DEBUG) {
                collidables[i].distance = dist;
            }

            //check collision
            if (dist < radius + buffer) {
                if (DEBUG)
                    console.log("distance:", dist, "radius:", radius + buffer);

                switch (collidables[i].type) {
                    case "rock":
                        if (!myShip.shieldsUp) {
                            updateScore(1, "hit");
                            myShip.explode();
                            hub.server.playerExplode(i, qs.roomId);
                        }
                        break;

                    case "item":
                        if (myShip.fx)
                            myShip.fx.clearFX(myShip);
                        myShip.isUnderEffect = true;
                        switch (collidables[i].name) {
                            case 0:
                                updateScore(1, "bonus");
                                console.log("points");
                                break;
                            case 1:
                                myShip.fx = new effects.shieldFx(myShip);
                                canvas.textContent = "Shields Up!";
                                break;
                            case 2:
                                myShip.fx = new effects.shrinkFx(myShip);
                                canvas.textContent = "Shrink Ray!";
                                break;
                            case 3:
                                myShip.fx = new effects.drunkFx(myShip, 20);
                                canvas.textContent = "Drunk Driving!";
                                break;
                        }
                        ;
                        collidables[i].timeout = 0;
                        hub.server.playerTakesBonus(collidables[i].name, i);
                        break;

                    case "ship":
                        myShip.isUnderEffect = true;
                        myShip.isHelmsLocked = true;

                        //perhaps just trigger key click
                        if (myShip.x > wingMan.x) {
                            myShip.fx = new effects.bumpFX(myShip, true);
                            hub.server.playerBump(false);
                        } else {
                            myShip.fx = new effects.bumpFX(myShip, false);
                            hub.server.playerBump(true);
                        }
                        break;
                }
            }
        }
    }
}
;

function updateBonus() {
    if (IsGameStarted) {
        if (bonusArr != null) {
            $.each(bonusArr, function (index, bonusItem) {
                if (bonusItem != null && bonusItem.timeout > 0) {
                    bonusItem.timeout--;
                } else {
                    if (DEBUG) {
                        // console.log("splice at index=", index);
                    }
                    bonusArr.splice(index, 1);
                }
            });
        }
    }
}
;

function updateScore(playerIndex, updateType) {
    switch (updateType) {
        case "bonus":
            myShip.isUnderEffect = false;
            switch (playerIndex) {
                case 1:
                    player1Score.value += SCOREBONUS;
                    break;
                case 2:
                    player2Score.value += SCOREBONUS;
                    break;
            }
            break;

        case "hit":
            switch (playerIndex) {
                case 1:
                    if (player1Score.value > HIT_VALUE) {
                        player1Score.value -= HIT_VALUE;
                    } else
                        player1Score.value = 0;
                    break;
                case 2:
                    if (player2Score.value > HIT_VALUE)
                        player2Score.value -= HIT_VALUE;
                    else
                        player2Score.value = 0;
                    break;
            }
            break;
    }
}
;

function updateBonusEffect(ship) {
    if (ship.isUnderEffect) {
        ship.applyEffect();
    }
}
;

function whatKey(evt) {
    if (!myShip.isHit && !myShip.isHelmsLocked) {
        // Flag to put variables back if we hit an edge of the board.
        var flag = 0;

        // Get where the ship was before key process.
        myShip.oldX = myShip.x;
        myShip.oldY = myShip.y;

        switch (evt.keyCode) {
            case 37:
                myShip.x = myShip.x - 30;
                if (myShip.x < 30) {
                    // If at edge, reset ship position and set flag.
                    myShip.x = 30;
                    flag = 1;
                }
                break;
            case 39:
                myShip.x = myShip.x + 30;
                if (myShip.x > backGroundX - 30) {
                    // If at edge, reset ship position and set flag.
                    myShip.x = backGroundX - 30;
                    flag = 1;
                }
                break;
            case 40:
                myShip.y = myShip.y + 30;
                if (myShip.y > backGroundY) {
                    // If at edge, reset ship position and set flag.
                    myShip.y = backGroundY;
                    flag = 1;
                }
                break;
            case 38:
                myShip.y = myShip.y - 30;
                if (myShip.y < 0) {
                    // If at edge, reset ship position and set flag.
                    myShip.y = 0;
                    flag = 1;
                }
                break;
            case 89:
                if (isReadyToExit) {
                    hub.server.endGame(qs['roomId'], player1Score.value);
                }
                break;
            case 27:
                isReadyToExit = true;
                showMessage("Are You Sure Y/N ?");
                break;
            case 78:
                showMessage("Click 'Esc' to exit the room !!!");
                isReadyToExit = false;
                break;
        }

        // If flag is set, the ship did not move.
        // Put everything back the way it was.
        if (flag && !myShip.isHelmsLocked) {
            myShip.x = myShip.oldX;
            myShip.y = myShip.oldY;
        } else
            hub.server.shipMove(myShip.x, myShip.y, "");
    }
}
;

function mouseMove(evt) {
    if ((evt.clientX < backGroundX - 30 && evt.clientY < backGroundY - 10 && evt.clientX > 30 && evt.clientY > 50) && (evt.clientX > 0 && evt.clientY > 0)) {
        evt.preventDefault();
        if (!myShip.isHit && IsGameStarted && !myShip.isHelmsLocked) {
            myShip.x = evt.clientX;
            myShip.y = evt.clientY;
            hub.server.shipMove(myShip.x, myShip.y, "");
        }
        this.style.cursor = 'none';
    } else {
        this.style.cursor = 'auto';
    }
}
;

//#endregion
//#region Utils
// Read a page's GET URL variables and return them as an associative array.
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function getCenterPoint(object) {
    return { x: Math.round(object.x + object.width / 2), y: Math.round(object.y + object.height / 2) };
}

function showMessage(message) {
    $("#ClientMessages").text(message).show();
}
//#endregion
//# sourceMappingURL=main.js.map
