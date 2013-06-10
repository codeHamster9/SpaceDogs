var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="effectBase.ts" />
var effects;
(function (effects) {
    var drunkFx = (function (_super) {
        __extends(drunkFx, _super);
        function drunkFx(ship, alcoholLvl) {
                _super.call(this, "drunk", ship);
            this.amount = alcoholLvl;
            this.borderX = document.getElementById("myCanvas").clientWidth;
            this.borderY = document.getElementById("myCanvas").clientHeight;
            this.inverted = false;
        }
        drunkFx.prototype.apply = function (ship) {
            if(this.duration % 3 == 0) {
                var drunkX = Math.round(Math.random() * this.amount);
                var drunkY = Math.round(Math.random() * this.amount);
                //TODO: check for screen Boundries;
                if(!this.inverted) {
                    ship.x = ship.x + drunkX;
                    ship.y = ship.y + drunkY;
                    this.inverted = true;
                } else {
                    ship.x = ship.x - drunkX;
                    ship.y = ship.y - drunkY;
                    this.inverted = false;
                }
                ;
            }
            if(this.duration == 0) {
                this.clearFX(ship);
            }
            this.duration--;
        };
        return drunkFx;
    })(effects.effectBase);
    effects.drunkFx = drunkFx;    
})(effects || (effects = {}));
//@ sourceMappingURL=drunkFx.js.map
