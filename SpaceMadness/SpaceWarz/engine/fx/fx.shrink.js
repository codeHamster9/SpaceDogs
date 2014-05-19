var fx;
(function(fx) {
    var fxshrink = (function(base) {

        function FxShrink(limit) {
            this.duration = 420;
            this.type = "shrink";
            this.effectLimit = limit || 32;
            base.prototype.constructor.call(this, this.type, this.duration);
        }

        extend(FxShrink, base);

        FxShrink.prototype.clearFX = function(ship) {
            ship.height = 60;
            ship.width = 60;
            base.prototype.clearFX.call(this, ship);

        };

        FxShrink.prototype.apply = function(ship) {
            if (ship.width > this.effectLimit) {
                ship.width--;
            }
            if (ship.height > this.effectLimit) {
                ship.height--;
            }
            this.duration--;

            if (this.duration === 0) {
                this.clearFX(ship);
            }
        };

        return FxShrink;

    }(fx.base));

    fx.shrink = fxshrink;

}(fx));
