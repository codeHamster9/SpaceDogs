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

var fx;
(function(fx) {
    var fxbase = (function() {

        function FxBase(duration, type) {
            this.duration = duration;
            this.type = type;
        }

        FxBase.prototype.apply = function() {};
        
        FxBase.prototype.clearFX = function() {
            this.isUnderEffect = false;
            this.fx = null;
            document.getElementById('myCanvas').textContent = "";
        };

        return FxBase;

    }());

    fx.base = fxbase;

}(fx || (fx = {})));
