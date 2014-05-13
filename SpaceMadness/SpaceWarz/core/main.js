//#region variables
//#region Globals
var canvas;
var context;
var hub;
var imageObjBackground = new Image();
var imageRock = new Image();
var imageBonus = new Image();

// background value's
var backgroundVelocity = 0;
var backGroundX = 840;
var backGroundY = 440;

var Damage_MAX = 420;
var Hit_Value = 35;

// value's for the bonus
var frameCounter = 0;
var bonusArr = [];

// value's for rotate the rock's
var TO_RADIANS = Math.PI / 180;

var explosionArray = [];
var rocksArr = [];
var shipTransform = [];

var myShip, wingMan;
var scorePlayer2 = 0, scorePlayer1 = 0;

var CountdownTimer = 2;
var IsGameStarted = false;
var isReadyToExit = false;
var userId;
var roomId;
var FPS = 0;
var backGroundSpeed = 0;
var onScreenText = "";
var isHelmsLocked = false;
//#endregion

//#region Objects




//#endregion

//#endregion

//#region Game Loading
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setInterval(gameLoop, FPS);
            };
})();

window.onload = function () {

    var queryValues = getUrlVars();
    userId = queryValues["userId"];
    roomId = queryValues["roomId"];

    if (window.hasOwnProperty('prompt')) {
        delete window.prompt;
    }
    if (userId == null)
        userId = window.prompt("enterName", "guest");

    //#region init variables

    canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');

    if (window.addEventListener) {
        canvas.addEventListener('mousemove', mouseMove, false);
        window.addEventListener('keydown', whatKey, false);
    }
    else if (window.attachEvent) {
        canvas.attachEvent('onmousemove', mouseMove);
        window.attachEvent('onkeydown', whatKey);
    }

    imageRock.src = "Images/asteroid.png";
    imageObjBackground.src = "Images/space_background.jpg";
    imageBonus.src = "Images/bonus1.png";

    // Player 1
    myShip = new spaceShip();
    myShip.x = 200;
    myShip.y = 430;
    myShip.oldX = 200;
    myShip.oldY = 430;
    myShip.width = 120;
    myShip.height = 120;
    myShip.image.src = 'Images/spaceship1.png';
    myShip.isHit = false;
    myShip.isUnderEffect = false;
    myShip.damageBar = 0;
    myShip.id = "myShip";
    myShip.Transform = false;

    // Player 2
    wingMan = new spaceShip();
    wingMan.x = 700;
    wingMan.y = 430;
    wingMan.oldX = 0;
    wingMan.oldY = 0;
    wingMan.width = 60;
    wingMan.height = 60;
    wingMan.image.src = 'Images/spaceship2.png';
    wingMan.isHit = false;
    wingMan.isUnderEffect = false;
    wingMan.damageBar = 0;
    wingMan.id = "wingman";
    wingMan.Transform = false;

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
    for (var i = 0; i < 35 * 1; i++) {
        shipTransform[i] = {
            image: new Image()
        };

        shipTransform[i].image.src = "Images/New ship/tmp-" + k + ".gif";
        if (i % 1 === 0) {
            k++;
        }
    }

    //in Debug Mode
    if (roomId == null) {
        console.log("Debug");
        roomId = "r1 ";
    }

    var qs = "roomId=" + roomId + "&userId=" + userId;
    $.connection.hub.qs = qs;
    hub = $.connection.spaceHub;

    //#endregion

    //#region client Methods
    $.connection.hub.start().done(function () {
        // $.connection.hub.logging = true;
    });

    hub.client.shipMoved = function (x, y, id) {
        if (IsGameStarted) {
            wingMan.x = x;
            wingMan.y = y;
        }
    };

    hub.client.setRockData = function (data) {
        rocksArr[data.Index] = new spaceRock();
        rocksArr[data.Index].x = data.X;
        rocksArr[data.Index].y = data.Y;
        rocksArr[data.Index].speed = data.Speed;
        rocksArr[data.Index].angle = data.Angle;
        rocksArr[data.Index].rotationSpeed = data.RotationSpeed;
        rocksArr[data.Index].height = data.Height;
        rocksArr[data.Index].width = data.Width;
    };

    hub.client.setRockArray = function (data) {
        for (var i = 0; i < data.length; i++) {
            rocksArr[i] = new spaceRock();
            rocksArr[i].x = data[i].X;
            rocksArr[i].y = data[i].Y;
            rocksArr[i].speed = data[i].Speed;
            rocksArr[i].angle = data[i].Angle;
            rocksArr[i].rotationSpeed = data[i].RotationSpeed;
            rocksArr[i].height = data[i].Height;
            rocksArr[i].width = data[i].Width;
        }
    };

    hub.client.setBonusData = function (data) {
        var now = moment().format('h:mm:ss');
        updateBonus(data);
    }

    hub.client.wingManExplode = function (data) {
        if (IsGameStarted) {
            wingMan.takeHit();
            updateScore(2, "hit");
        }
    }

    hub.client.startGame = function (playerIndex) {
        switch (playerIndex) {
            case 1:
                // myShip.image.src = 'Images/spaceship1.png'
                myShip.image.src = 'Images/New ship/tmp-35.gif'
                wingMan.image.src = 'Images/spaceship2.png'
                myShip.Transform = true;
                myShip.frameIndex = 0;

                break;
            case 2:
                myShip.image.src = 'Images/spaceship2.png'
                wingMan.image.src = 'Images/spaceship1.png'
                myShip.x = wingMan.x;
                myShip.y = wingMan.y;
                wingMan.x = myShip.oldX;
                wingMan.y = myShip.oldY;

                break;

        }
        showMessage("Click 'Esc' to exit the room !!!");
        FPS = 1000 / 60;
        backGroundSpeed = 2;
        hub.server.initRockArray();
        gameLoop();
    }

    hub.client.playerWait = function () {
        showMessage("Wait for another player to arrive ...");
        drawBackround();
        drawScores();
        drawLifeBar(myShip.damageBar, 1);
        drawLifeBar(wingMan.damageBar, 2);
        drawPlayer(myShip);
        drawPlayer(wingMan);
    }

    hub.client.redirectToLobby = function (urlTarget, msg) {
        showMessage(msg);
        FPS = 0;
        window.location = urlTarget;
    };

    hub.client.playerTakeBonus = function (type, bonusIndex) {
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

    hub.client.wingmanBump = function () {
        var effect = new bumpEffect(false);
        myShip.fx = effect;
        myShip.isUnderEffect = true;
        console.log("bumped");
    }
    //#endregion
}

imageObjBackground.onload = function () {
    // draw background and both players
    context.drawImage(imageObjBackground, 0, 0);
    context.drawImage(myShip.image, myShip.x, myShip.y);
    context.drawImage(wingMan.image, wingMan.x, wingMan.y);
};

//#endregion

//#region gameLoop
function gameLoop() {
    frameCounter++
    if (!IsGameStarted) {
        if (frameCounter % 60 == 0 && frameCounter < 420) {
            drawTimer(CountdownTimer);
            CountdownTimer--;
            if (CountdownTimer <= 0)
                IsGameStarted = true;
        }
    }
    else {
        scorePlayer1++;
        scorePlayer2++;
        drawBackround();
        drawScores();
        drawRocks();
        drawBonus();
        drawLifeBar(myShip.damageBar, 1);
        drawLifeBar(wingMan.damageBar, 2);
        drawPlayer(myShip);
        drawPlayer(wingMan);
        checkColision();
        updateBonusEffect(myShip);
        updateBonusEffect(wingMan);
        drawText(onScreenText);
    }
    requestAnimFrame(gameLoop);
}

//#endregion

//#region Draw

function drawBackround() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(imageObjBackground, 0, backgroundVelocity);
    context.drawImage(imageObjBackground, 0, (-1 * (imageObjBackground.height - backgroundVelocity)));
    if (backgroundVelocity > imageObjBackground.height) {
        backgroundVelocity = 0;
    }
    backgroundVelocity += backGroundSpeed;
}

function drawLifeBar(minLifeBar, playerIndex) {
    var y = 100 + minLifeBar;
    //draw bar Frame
    context.beginPath();
    if (playerIndex === 1) {
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
    if (playerIndex === 1) {
        context.moveTo(11, y);//start
        context.lineTo(11, 489);//left
        context.lineTo(29, 489);//footer
        context.lineTo(29, y);//right
        context.lineTo(11, y);//head
    } else {
        context.moveTo(871, y);//start
        context.lineTo(871, 489);//left
        context.lineTo(889, 489);//footer
        context.lineTo(889, y);//right
        context.lineTo(871, y);//head
    }

    context.fillStyle = "rgba(255,0,0,0.5)";
    context.fill();
    context.closePath();
}

function drawPlayer(ship) {
    if (ship.isHit) {
        drawExplosion(ship);
    }
    else {
        context.drawImage(ship.image, ship.x, ship.y, ship.width, ship.height);
    }
    if (ship.Transform) {
        
        drawShipTransform(ship);

    }
}

function drawScores() {
    context.fillStyle = "rgba(255,0,0,0.5)";
    context.font = 'italic bold 30px sans-serif';
    context.textBaseline = 'bottom';
    context.fillText(scorePlayer1, 60, 35);
    context.fillText(scorePlayer2, 780, 35);
}

function drawTimer(value) {
    // draw background and both players
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(imageObjBackground, 0, 0);
    drawLifeBar(myShip.damageBar, 1);
    drawLifeBar(wingMan.damageBar, 2);
    drawPlayer(myShip);
    drawPlayer(wingMan);
    context.fillStyle = "rgba(255,0,0,0.5)";
    context.font = 'italic bold 70px sans-serif';
    context.textBaseline = 'bottom';
    context.fillText(value, 430, 280);
}

function drawBonus() {
    $.each(bonusArr, function (index, bonusItem) {
        if (bonusItem.timeout > 0) {
            context.drawImage(imageBonus, bonusItem.x, bonusItem.y);
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
        }
        else {
            rocksArr[i].y = rocksArr[i].y + rocksArr[i].speed;
        }
    }
}

function drawExplosion(ship) {
    if (ship.frameIndex < explosionArray.length) {
        context.drawImage(explosionArray[ship.frameIndex].image, ship.x - 30, ship.y - 30);
        ship.frameIndex++;
    }
    else {
        ship.isHit = false;
    }
}

function drawShipTransform(ship) {
    if (ship.frameIndex < shipTransform.length) {
        context.drawImage(shipTransform[ship.frameIndex].image, ship.x, ship.y, 120, 120);
        ship.frameIndex++;
    }
    else {
        ship.Transform = false;
    }
}

function drawText(txt) {
    context.fillStyle = "rgba(255,0,0,0.5)";
    context.font = 'italic bold 35px sans-serif';
    context.textBaseline = 'bottom';
    context.fillText(txt, canvas.clientWidth / 2, 50);
}

function drawRotatedImage(image, x, y, angle, width, height) {

    // save the current co-ordinate system 
    // before we screw with it
    context.save();

    // move to the middle of where we want to draw our image
    context.translate(x, y);

    // rotate around that point, converting our 
    // angle from degrees to radians 
    context.rotate(angle * TO_RADIANS);

    // draw it up and to the left by half the width
    // and height of the image 
    context.drawImage(image, -(image.width / 2), -(image.height / 2), width, height);

    // and restore the co-ords to how they were when we began
    context.restore();
}
//#endregion

//#region Update
function updateBonus(data) {
    if (IsGameStarted) {
        //bonusArr = data;
        for (var i = 0; i < data.bonusim.length; i++) {
            bonusArr[i] = new bonusItem();
            bonusArr[i].x = data.bonusim[i].x;
            bonusArr[i].y = data.bonusim[i].y;
            bonusArr[i].timeout = data.bonusim[i].timeout;
            bonusArr[i].value = data.bonusim[i].value;
            bonusArr[i].type = data.bonusim[i].type;
            bonusArr[i].effectDuration = data.bonusim[i].effectDuration;
            bonusArr[i].width = imageBonus.width;
            bonusArr[i].height = imageBonus.height;
        }
    }
}

function updateScore(playerIndex, updateType) {
    switch (updateType) {
        case "bonus":
            switch (playerIndex) {
                case 1: scorePlayer1 += 1000;
                    break;
                case 2: scorePlayer2 += 1000;
                    break;
            }
            break;

        case "hit":
            switch (playerIndex) {
                case 1:
                    if (scorePlayer1 > 500) {
                        scorePlayer1 -= 500;
                    }
                    else scorePlayer1 = 0
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

    if (!myShip.isHit && !myShip.shieldsUp) {
        var shipCenter = getCenterPoint(myShip)
        var wingManCenter = getCenterPoint(wingMan);
        for (var i = 0; i < rocksArr.length; ++i) {
            var rockCenter = getCenterPoint(rocksArr[i]);
            var deltax = shipCenter.x - rockCenter.x;
            var deltay = shipCenter.y - rockCenter.y;
            var dist = Math.sqrt(deltax * deltax + deltay * deltay);
            if (dist < 30) {
                updateScore(1, "hit");
                myShip.explode(i);
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
                if (myShip.x > wingMan.x) {
                    var effect = new bumpEffect(true);
                    myShip.isUnderEffect = true;
                    myShip.fx = effect;
                    var weffect = new bumpEffect(false);
                    wingMan.isUnderEffect = true;
                    wingMan.fx = weffect;
                }
                else {
                    var effect = new bumpEffect(false);
                    myShip.isUnderEffect = true;
                    myShip.fx = effect;
                    var weffect = new bumpEffect(true);
                    wingMan.isUnderEffect = true;
                    wingMan.fx = weffect;
                }
                //myShip.explode(i);
            }
        }
    }


    for (var i = 0; i < bonusArr.length; ++i) {
        if (bonusArr[i].timeout > 0) {
            var center = getCenterPoint(bonusArr[i]);

            // chekc if bonusItem is Taken
            if (center.x >= myShip.x - 10 && center.x <= myShip.x + 70) {
                if (center.y + 25 >= myShip.y + 10 && center.y + 25 <= myShip.y + 80) {
                    bonusArr[i].timeout = 0;
                    if (bonusArr[i].type == 0) {
                        updateScore(1, "bonus");
                        console.log("points");
                    }
                    else switch (bonusArr[i].type) {
                        case 1:
                            if (myShip.fx)
                                myShip.fx.clearFX(myShip);
                            myShip.isUnderEffect = true;
                            var effect = new shieldsEffect();
                            myShip.fx = effect;
                            onScreenText = "Shields Up!";
                            break;
                        case 2:
                            if (myShip.fx)
                                myShip.fx.clearFX(myShip);
                            myShip.isUnderEffect = true;
                            var effect = new shrinkEffect(32);
                            myShip.fx = effect;
                            onScreenText = "Shrink Ray!";
                            break;
                        case 3:
                            if (myShip.fx)
                                myShip.fx.clearFX(myShip);
                            myShip.isUnderEffect = true;
                            var effect = new drunkEffect(3);
                            myShip.fx = effect;
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
    if (!myShip.isHit && !isHelmsLocked && isHelmsLocked) {
        // Flag to put variables back if we hit an edge of the board.
        var flag = 0;

        // Get where the ship was before key process.
        myShip.oldX = myShip.x;
        myShip.oldY = myShip.y;

        switch (evt.keyCode) {
            case 37:  // Left arrow.
                myShip.x = myShip.x - 30;
                if (myShip.x < 30) {
                    // If at edge, reset ship position and set flag.
                    myShip.x = 30;
                    flag = 1;
                }
                break;
            case 39: // Right arrow.
                myShip.x = myShip.x + 30;
                if (myShip.x > backGroundX - 30) {
                    // If at edge, reset ship position and set flag.
                    myShip.x = backGroundX - 30;
                    flag = 1;
                }
                break;
            case 40: // Down arrow
                myShip.y = myShip.y + 30;
                if (myShip.y > backGroundY) {
                    // If at edge, reset ship position and set flag.
                    myShip.y = backGroundY;
                    flag = 1;
                }
                break;
            case 38: // Up arrow 
                myShip.y = myShip.y - 30;
                if (myShip.y < 0) {
                    // If at edge, reset ship position and set flag.
                    myShip.y = 0;
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
            case 78:// No
                showMessage("Click 'Esc' to exit the room !!!");
                isReadyToExit = false;
                break;
        }

        // If flag is set, the ship did not move.
        // Put everything back the way it was.
        if (flag && !isHelmsLocked) {
            myShip.x = myShip.oldX;
            myShip.y = myShip.oldY;
        }
        else hub.server.moveShip(myShip.x, myShip.y, "");
    }
}

function mouseMove(evt) {
    if ((evt.clientX < backGroundX && evt.clientY < backGroundY) && (evt.clientX > 0 && evt.clientY > 0)) {
        evt.preventDefault();
        if (!myShip.isHit && IsGameStarted && !isHelmsLocked) {
            myShip.x = evt.clientX;
            myShip.y = evt.clientY;
            hub.server.moveShip(myShip.x, myShip.y, "");
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

