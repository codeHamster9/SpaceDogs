var engine;
window.onload = function() {
    var newEngine = new engine.core();

    newEngine.globals.imageObjBackground.onload = function() {
        newEngine.globals.context.drawImage(newEngine.globals.imageObjBackground, 0, 0);
        newEngine.globals.context.drawImage(newEngine.globals.player2Ship.image, newEngine.globals.player2Ship.x, newEngine.globals.player2Ship.y);
        newEngine.globals.context.drawImage(newEngine.globals.player1Ship.image, newEngine.globals.player1Ship.x, newEngine.globals.player1Ship.y);
    };

    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function(callback) {
                window.setInterval(newEngine.gameLoop, newEngine.globals.FPS);
        };
    }());

    var queryValues = getUrlVars();
    newEngine.globals.userId = 22;
    newEngine.globals.roomId = queryValues["roomId"];

    if (window.hasOwnProperty('prompt')) {
        delete window.prompt;
    }
    if (newEngine.globals.userId == null) {
        newEngine.globals.userId = window.prompt("enterName", "guest");
    }
    newEngine.startEngine();

    if (window.addEventListener) {
        newEngine.globals.canvas.addEventListener('mousemove', newEngine.update.mouseMove.bind(newEngine), false);
        window.addEventListener('keydown', newEngine.update.whatKey.bind(newEngine), false);
    } else if (window.attachEvent) {
        newEngine.globals.canvas.attachEvent('onmousemove', newEngine.update.mouseMove.bind(newEngine));
        window.attachEvent('onkeydown', newEngine.update.whatKey.bind(newEngine));
    }
}


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
    document.getElementById("#ClientMessages").text(message).show();
}