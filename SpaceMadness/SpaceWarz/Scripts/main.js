var engine; 
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

    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function(callback) {
                window.setInterval(newEngine.core.gameLoop, newEngine.core.globals.FPS);
        };
    }());

    var queryValues = getUrlVars();
    newEngine.core.globals.userId = queryValues["userId"];
    newEngine.core.globals.roomId = queryValues["roomId"];

    if (window.hasOwnProperty('prompt')) {
        delete window.prompt;
    }
    if (newEngine.core.globals.userId == null) {
        newEngine.core.globals.userId = window.prompt("enterName", "guest");
    }
    newEngine.core.startEngine(newEngine.draw, newEngine.update);

    if (window.addEventListener) {
        newEngine.core.globals.canvas.addEventListener('mousemove', newEngine.update.mouseMove.bind(newEngine), false);
        window.addEventListener('keydown', newEngine.update.whatKey.bind(newEngine), false);
    } else if (window.attachEvent) {
        newEngine.core.globals.canvas.attachEvent('onmousemove', newEngine.update.mouseMove.bind(newEngine));
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
    $("#ClientMessages").text(message).show();
}
