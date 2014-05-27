//'use strict';

var engine,common;
window.onload = function () {
    var newEngine = new engine.core();

    newEngine.startEngine();
    
    window.showMessage = function (message) {
        document.getElementById("ClientMessages").innerHTML = message;
    };
};



