/* Fx Item Factory class */

var fx;
(function(fx) {
    var itemFactory = (function(base) {

        function FxItemFactory() {
            // FxItemFactory.superclass.constructor(this);
        }

        extend(FxItemFactory, base);

        FxItemFactory.prototype.createfx = function(type) {
            var fxr;
            switch (type) {
                case "Shield":
                    fxr = new fx.shield();
                    break;
                case "Shrink":
                    fxr = new fx.shrink(32);
                    break;
                case "Drunk":
                    fxr = new fx.drunk(30, 30);
                    break;
            }
            return fxr;
        };

        return FxItemFactory;

    }(fx.factory));

    fx.itemFactory = itemFactory;

}(fx));
