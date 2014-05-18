/*function extend(subClass, superClass) {
    var F = function() {};
    F.prototype = new F();
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;

    subClass.superclass = superClass.prototype;
    if (superClass.prototype.constructor == Object.prototype.constructor) {
        superClass.prototype.constructor = superClass;
    }
}*/

var effects;
(function(effects) {
    var shieldFX = (function(effectBase) {

        function ShieldEffect() {
            this.duration = 420;
            this.type = "shield";
            effectBase.prototype.constructor.call(this, this.duration, this.type);
        }

        extend(ShieldEffect, effectBase);

        ShieldEffect.prototype.apply = function(ship) {
            ship.shieldsUp = true;
            if (this.duration == 0) {
                this.clearFX(ship);
            }
            this.duration--;
        };

        ShieldEffect.prototype.clearFX = function(ship) {
            ship.shieldsUp = false;
            effectBase.prototype.clearFX.call(this, ship);
        };

        return ShieldEffect;

    }(effects.effectBase));

    effects.shieldEffect = shieldFX;

}(effects));
