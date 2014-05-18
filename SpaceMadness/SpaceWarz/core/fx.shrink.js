/*function extend(subClass, superClass) {
    var F = function () { };
    F.prototype = new F();
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;

    subClass.superclass = superClass.prototype;
    if (superClass.prototype.constructor == Object.prototype.constructor) {
        superClass.prototype.constructor = superClass;
    }
}*/

var effects;
(function (effects) {
    var shrinkEffect = (function (effectBase) {

        function ShrinkEffect(limit) {
            this.duration = 420;
            this.type = "shrink";
            this.effectLimit = limit || 32;
            effectBase.prototype.constructor.call(this, this.type, this.duration);
        }

        extend(ShrinkEffect, effectBase);

        ShrinkEffect.prototype.clearFX = function (ship) {
            console.log(ship.id);         
            ship.height = 60;
            ship.width = 60;
            effectBase.prototype.clearFX.call(this,ship);

        };

        ShrinkEffect.prototype.apply = function (ship) {
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

        return ShrinkEffect;

    }(effects.effectBase));

    effects.shrinkEffect = shrinkEffect;

}(effects));