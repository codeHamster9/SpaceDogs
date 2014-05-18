function extend(subClass, superClass) {
    var F = function() {};
    F.prototype = new F();
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;

    subClass.superclass = superClass.prototype;
    if (superClass.prototype.constructor == Object.prototype.constructor) {
        superClass.prototype.constructor = superClass;
    }
}

var effects;
(function(effects) {
    var effectBase = (function() {

        function EffectBase(duration, type) {
            this.duration = duration;
            this.type = type;
        }
        return EffectBase;
    }());

    effectBase.prototype.apply = function() {};
    effectBase.prototype.clearFX = function() {
        this.isUnderEffect = false;
        this.fx = null;
        document.getElementById('myCanvas').textContent = "";
    };

    effects.effectBase = effectBase;

}(effects || (effects = {})));
