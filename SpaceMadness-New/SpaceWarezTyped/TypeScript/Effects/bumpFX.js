var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="effectBase.ts" />
var effects;
(function (effects) {
    var bumpFX = (function (_super) {
        __extends(bumpFX, _super);
        function bumpFX(ship, hitter) {
                _super.call(this, "bump", ship);
            this.borderX = document.getElementById("myCanvas").clientWidth;
            this.borderY = document.getElementById("myCanvas").clientHeight;
            this.duration = 8;
            this.role = hitter;
        }
        bumpFX.prototype.apply = function (ship) {
            if(ship.x < this.borderX) {
                if(this.role) {
                    ship.x = (ship.x + 3.5);
                } else {
                    ship.x = (ship.x - 3.5);
                }
                ship.isHelmsLocked = true;
            }
            if(this.duration == 0) {
                this.clearFX(ship);
            }
            this.duration--;
        };
        bumpFX.prototype.clearFX = function (ship) {
            ship.isUnderEffect = false;
            ship.fx = null;
            ship.isHelmsLocked = false;
        };
        return bumpFX;
    })(effects.effectBase);
    effects.bumpFX = bumpFX;    
})(effects || (effects = {}));
//@ sourceMappingURL=bumpFX.js.map
