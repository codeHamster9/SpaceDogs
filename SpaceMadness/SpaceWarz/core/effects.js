var effects;
(function (effects) {
    var effectBase = (function () {

        function EffectBase(duration, type) {
            this.duration = duration;
            this.type = type;
        }
        return EffectBase;
    }());

    effectBase.prototype.apply = function () { };
    effectBase.prototype.clearFX = function () { };

    effects.effectBase = effectBase;

}(effects || (effects = {})));