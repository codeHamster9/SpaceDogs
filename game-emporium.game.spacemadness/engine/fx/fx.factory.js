/* Fx Factory abstract class */

var fx;
(function(fx) {
    var factory = (function() {
        function FxFactory() {};

        FxFactory.prototype.getFx = function(type) {
            var newfx = this.createfx(type);
            return newfx;
        };

        FxFactory.prototype.createfx = function(type) {
            throw new Error('unspported operation on an abstract class');
        };

        return FxFactory;

    }());

    fx.factory = factory;

}(fx));
