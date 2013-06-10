/// <reference path="../spaceShip.ts" />
var effects;
(function (effects) {
    var effectBase = (function () {
        function effectBase(type, ship) {
            this.type = type;
            this.Type = type;
            this.duration = 420;
            this.ship = ship;
        }
        effectBase.prototype.apply = function (ship) {
            //override thisss
                    };
        effectBase.prototype.clearFX = function (ship) {
            ship.isUnderEffect = false;
            ship.fx = null;
            document.getElementById('myCanvas').textContent = "";
        };
        return effectBase;
    })();
    effects.effectBase = effectBase;    
})(effects || (effects = {}));
//@ sourceMappingURL=effectBase.js.map
