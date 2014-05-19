var fx;
(function(fx) {
    var fxdrunk = (function(base) {

        function FxDrunk(alcoholLvl, backGroundX) {
            this.backGroundX = backGroundX;
            this.duration = 420;
            this.type = "drunk";
            this.amount = alcoholLvl;
            base.prototype.constructor.call(this, this.duration, this.type);
        }

        extend(FxDrunk, base);

        FxDrunk.prototype.apply = function(ship) {
            if (ship.x < this.backGroundX) {
                ship.x = ship.x + this.amount;
            }
            if (this.duration == 0) {
                this.clearFX(ship);
            }

            this.duration--;
        };

        FxDrunk.prototype.clearFX = function(ship) {
            base.prototype.clearFX.call(this, ship);
        };

        return FxDrunk;

    }(fx.base));

    fx.drunk = fxdrunk;


}(fx));
