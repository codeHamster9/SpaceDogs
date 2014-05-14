//#region Game Loading

var engine;
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setInterval(engine.core.gameLoop, engine.core.globals.FPS);
    };
}());

window.onload = function() {


    var newEngine = {};
    newEngine.core = new engine.core();
    newEngine.draw = new engine.draw(newEngine.core);
    newEngine.update = new engine.update(newEngine.core);

    newEngine.core.globals.imageObjBackground.onload = function() {
        newEngine.core.globals.context.drawImage(newEngine.core.globals.imageObjBackground, 0, 0);
        newEngine.core.globals.context.drawImage(newEngine.core.globals.player2Ship.image, newEngine.core.globals.player2Ship.x, newEngine.core.globals.player2Ship.y);
        newEngine.core.globals.context.drawImage(newEngine.core.globals.player1Ship.image, newEngine.core.globals.player1Ship.x, newEngine.core.globals.player1Ship.y);
    };


    var queryValues = getUrlVars();
    newEngine.core.globals.userId = queryValues["userId"];
    newEngine.core.globals.roomId = queryValues["roomId"];

    if (window.hasOwnProperty('prompt')) {
        delete window.prompt;
    }
    if (newEngine.core.globals.userId == null)
        newEngine.core.globals.userId = window.prompt("enterName", "guest");

    //#region init variables

    newEngine.core.startEngine(newEngine.draw, newEngine.update);

    if (window.addEventListener) {
        newEngine.core.globals.canvas.addEventListener('mousemove', mouseMove, false);
        window.addEventListener('keydown', whatKey, false);
    } else if (window.attachEvent) {
        newEngine.core.globals.canvas.attachEvent('onmousemove', mouseMove);
        window.attachEvent('onkeydown', whatKey);
    }

    //in Debug Mode
    if (roomId == null) {
        console.log("Debug");
        roomId = "r1 ";
    }



    newEngine.core.hub.client.shipMoved = function(x, y, id) {
        if (IsGameStarted) {
            newEngine.core.globals.player2Ship.x = x;
            newEngine.core.globals.player2Ship.y = y;
        }
    };

    newEngine.core.hub.client.setRockData = function(data) {
        newEngine.core.globals.rocksArr[data.Index] = new spaceRock(data.X, data.Y, data.Speed, data.Angle, data.RotationSpeed, data.Width, data.Height);
    };

    newEngine.core.hub.client.setRockArray = function(data) {
        for (var i = 0; i < data.length; i++) {
            rnewEngine.core.globals.rocksArr[i] = new spaceRock(data.X, data.Y, data.Speed, data.Angle, data.RotationSpeed, data.Width, data.Height);

        }
    };

    newEngine.core.hub.client.setBonusData = function(data) {
        var now = moment().format('h:mm:ss');
        updateBonus(data);
    }

    newEngine.core.hub.client.wingManExplode = function(data) {
        if (IsGameStarted) {
            wingnewEngine.core.globals.player2ShipMan.takeHit();
            updateSnewEngine.core(2, "hit");
        }
    }

    newEngine.core.hub.client.startGame = function(playerIndex) {
        switch (playerIndex) {
            case 1:
                // newEngine.core.globals.player1Ship.image.src = 'Images/spaceship1.png'
                newEngine.core.player1Ship.image.src = 'Images/New ship/tmp-35.gif'
                newEngine.core.player2Ship.image.src = 'Images/spaceship2.png'
                newEngine.core.player1Ship.Transform = true;
                newEngine.core.player1Ship.frameIndex = 0;

                break;
            case 2:
                newEngine.core.player1Ship.image.src = 'Images/spaceship2.png'
                newEngine.core.player2Ship.image.src = 'Images/spaceship1.png'
                newEngine.core.player1Ship.x = newEngine.core.player2Ship.x;
                newEngine.core.player1Ship.y = newEngine.core.player2Ship.y;
                newEngine.core.player2Ship.x = newEngine.core.player1Ship.oldX;
                newEngine.core.player2Ship.y = newEngine.core.player1Ship.oldY;

                break;

        }
        showMessage("Click 'Esc' to exit the room !!!");
        backGroundSpeed = 2;
        newEngine.core.hub.server.initRockArray();
        newEngine.core.gameLoop();
    }

    newEngine.core.hub.client.playerWait = function() {
        showMessage("Wait for another player to arrive ...");
        drawBackround();
        drawSnewEngine.cores();
        drawLifeBar(newEngine.core.globals.player1Ship.damageBar, 1);
        drawLifeBar(wingMan.damageBar, 2);
        drawPlayer(newEngine.core.globals.player1Ship);
        drawPlayer(wingMan);
    }

    newEngine.core.hub.client.redirectToLobby = function(urlTarget, msg) {
        showMessage(msg);
        FPS = 0;
        window.location = urlTarget;
    };

    newEngine.core.hub.client.playerTakeBonus = function(type, bonusIndex) {
        bonusArr[bonusIndex].timeout = 0;
        switch (type) {
            case 0:
                updateSnewEngine.core(2, "bonus");
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

    newEngine.core.hub.client.wingmanBump = function() {
        var effect = new bumpEffect(false);
        newEngine.core.globals.player1Ship.fx = effect;
        newEngine.core.globals.player1Ship.isUnderEffect = true;
        console.log("bumped");
    }
    //#endregion
}

//#region Update


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
