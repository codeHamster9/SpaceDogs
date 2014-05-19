var fx;
(function(fx) {
    var fxbump = (function(base) {

        function FxBump(hitter, backGroundX) {
            this.backGroundX = backGroundX;
            this.duration = 8;
            this.type = "bump";
            this.role = hitter;
            base.prototype.constructor.call(this, this.duration, this.type);
        }

        extend(FxBump, base);

        FxBump.prototype.apply = function(ship) {

            if (ship.x < this.backGroundX) {
                if (this.hitter) {
                    ship.x = (ship.x + 3.5);
                } else {
                    ship.x = (ship.x - 3.5);
                }

                //isHelmsLocked = true;
                // change to event broadcast 
            }
            if (this.duration == 0) {
                this.clearFX(ship);
            }
            this.duration--;
        };

        FxBump.prototype.clearFX = function(ship) {
            ship.isUnderEffect = false;
            ship.fx = null;
            //isHelmsLocked = false;
            //onScreenText = "";
        };

        return FxBump;

    }(fx.base));

    fx.bump = fxbump;

}(fx));
