//'use strict';

var engine,common;
window.onload = function () {
    var newEngine = new engine.core();

    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setInterval(newEngine.gameLoop, newEngine.globals.FPS);
            };
    }());  

    newEngine.startEngine();
    
    window.showMessage = function (message) {
        document.getElementById("ClientMessages").innerHTML = message;
    };
};



