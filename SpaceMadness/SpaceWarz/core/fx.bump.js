function extend(subClass, superClass) {
    var F = function () { };
    F.prototype = new F();
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;

    subClass.superclass = superClass.prototype;
    if (superClass.prototype.constructor == Object.prototype.constructor) {
        superClass.prototype.constructor = superClass;
    }
}

var effects;
(function (effects) {
    var bumpFX = (function (effectBase) {

        function BumpEffect(hitter, backGroundX) {
            this.backGroundX = backGroundX;
            this.duration = 8;
            this.type = "bump";
            this.role = hitter;
            effectBase.prototype.constructor.call(this, this.duration, this.type);
        }

        extend(BumpEffect, effectBase);

        BumpEffect.prototype.apply = function (ship) {

            if (ship.x < this.backGroundX) {
                if (this.hitter) {
                    ship.x = (ship.x + 3.5);
                }
                else {
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

        BumpEffect.prototype.clearFX = function (ship) {
            ship.isUnderEffect = false;
            ship.fx = null;
            //isHelmsLocked = false;
            //onScreenText = "";
        };

        return BumpEffect;

    }(effects.effectBase));

    effects.bumpEffect = bumpFX;

}(effects));