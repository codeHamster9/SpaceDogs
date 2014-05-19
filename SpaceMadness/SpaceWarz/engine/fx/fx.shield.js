var fx;
(function(fx) {
    var fxshield = (function(base) {

        function FxShield() {
            this.duration = 420;
            this.type = "shield";
            base.prototype.constructor.call(this, this.duration, this.type);
        }

        extend(FxShield, base);

        FxShield.prototype.apply = function(ship) {
            ship.shieldsUp = true;
            if (this.duration == 0) {
                this.clearFX(ship);
            }
            this.duration--;
        };

        FxShield.prototype.clearFX = function(ship) {
            ship.shieldsUp = false;
            base.prototype.clearFX.call(this, ship);
        };

        return FxShield;

    }(fx.base));

    fx.shield = fxshield;

}(fx));
