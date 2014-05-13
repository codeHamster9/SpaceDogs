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
    var effectBase = (function(duration, type) {
        this.duration;
        this.type;
    })();

    effectBase.prototype.apply = function (ship) { };
    effectBase.prototype.clearFX = function (ship) { };

})(effects);




function shieldsEffect() {
    this.duration = 420;
    this.type = "shield";
    this.apply = function (ship) {
        ship.shieldsUp = true;
        if (this.duration == 0) {
            this.clearFX(ship);
        }
        this.duration--;
    };
    this.clearFX = function (ship) {
        ship.isUnderEffect = false;
        ship.fx = null;
        ship.shieldsUp = false;
        onScreenText = "";
    };
}


