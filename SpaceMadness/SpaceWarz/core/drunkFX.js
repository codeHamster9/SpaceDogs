var extend = (function extend(subClass, superClass) {
    var F = function () { };
    F.prototype = new F();
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;

    subClass.superclass = superClass.prototype;
    if (superClass.prototype.constructor == Object.prototype.constructor) {
        superClass.prototype.constructor = superClass;
    }
}());


var effects;
(function (effects) {
    var drunkFX = (function (effectBase) {


        function DrunkEffect(alcoholLvl) {
            this.duration = 420;
            this.type = "drunk";
            this.amount = alcoholLvl;
            effectBase.prototype.constructor.call(this, this.duration, this.type);
        }

        extend(DrunkEffect, effectBase);

        DrunkEffect.prototype.apply = function (ship) {
            if (ship.x < backGroundX)
                ship.x = ship.x + this.amount;
            if (this.duration == 0) {
                this.clearFX(ship);
            }
            this.duration--;
        };

        DrunkEffect.prototype.clearFX = function (ship) {
            ship.isUnderEffect = false;
            ship.fx = null;
            onScreenText = "";
        };

        return DrunkEffect;

    }(effects.effectBase));

    effects.drunkEffect = DrunkEffect;


}(effects))