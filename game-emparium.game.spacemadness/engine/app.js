//'use strict';

var engine,common;
window.onload = function () {
    var newEngine = new engine.core();

    newEngine.globals.imageObjBackground.onload = function () {
        newEngine.globals.context.drawImage(newEngine.globals.imageObjBackground, 0, 0);
    };

    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setInterval(newEngine.gameLoop, newEngine.globals.FPS);
            };
    }());

    var queryValues = common.utils.getUrlVars();
    newEngine.globals.userId = 22;
    newEngine.globals.roomId = queryValues["roomId"];

    if (window.hasOwnProperty('prompt')) {
        delete window.prompt;
    }
    if (newEngine.globals.userId === null) {
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

    window.showMessage = function (message) {
        document.getElementById("ClientMessages").innerHTML = message;
    };
};



