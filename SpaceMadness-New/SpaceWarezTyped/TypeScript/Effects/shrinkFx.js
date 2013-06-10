var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="effectBase.ts" />
var effects;
(function (effects) {
    var shrinkFx = (function (_super) {
        __extends(shrinkFx, _super);
        function shrinkFx(ship) {
                _super.call(this, "shrink", ship);
            this.resizeLimit = 32;
        }
        shrinkFx.prototype.apply = function (ship) {
            if(this.duration > 30) {
                this.shrink(ship);
            } else {
                this.grow(ship);
            }
            this.duration--;
            if(this.duration == 0) {
                this.clearFX(ship);
            }
        };
        shrinkFx.prototype.shrink = function (ship) {
            if(ship.width >= this.resizeLimit) {
                ship.width--;
                ship.height--;
            }
        };
        shrinkFx.prototype.grow = function (ship) {
            if(ship.width < ship.originalWidth) {
                ship.width++;
                ship.height++;
            }
        };
        shrinkFx.prototype.clearFX = function (ship) {
            ship.height = ship.originalHeight;
            ship.width = ship.originalWidth;
            _super.prototype.clearFX.call(this, ship);
        };
        return shrinkFx;
    })(effects.effectBase);
    effects.shrinkFx = shrinkFx;    
})(effects || (effects = {}));
//@ sourceMappingURL=shrinkFx.js.map
