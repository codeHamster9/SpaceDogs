/// <reference path="effectBase.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var effects;
(function (effects) {
    var shieldFx = (function (_super) {
        __extends(shieldFx, _super);
        function shieldFx(ship) {
            _super.call(this, "shield", ship);
        }
        shieldFx.prototype.apply = function (ship) {
            ship.shieldsUp = true;
            if (this.duration == 0)
                this.clearFX(ship);
            this.duration--;
        };

        shieldFx.prototype.clearFX = function (ship) {
            ship.shieldsUp = false;
            _super.prototype.clearFX.call(this, ship);
        };
        return shieldFx;
    })(effects.effectBase);
    effects.shieldFx = shieldFx;
})(effects || (effects = {}));
//# sourceMappingURL=shieldFx.js.map
