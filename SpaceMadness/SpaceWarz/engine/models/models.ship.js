'use strict';

(function (engine) {

    var ship = (function () {

        function Ship(id, x, y, width, height) {
            this.id = id;
            this.x = x;
            this.y = y;
            this.oldX = x;
            this.oldY = y;
            this.width = width;
            this.height = height;
            this.damageBar = 0;
            this.frameIndex = 0;
            this.isHit = false;
            this.isUnderEffect = false;
            this.shieldsUp = false;
            this.fx = new fx.base(); //effect Object
            this.image = new Image();
            this.Transform = {};
        }

        Ship.prototype.applyEffect = function () {
            if (this.fx.duration >= 0) {
                this.fx.apply(this);
            }
        };

        Ship.prototype.explode = function (rockIndex) {
            this.isHit = true;
            this.frameIndex = 0;
            this.takeHit();
            //hub.server.playerExplode(rockIndex);
        };

        Ship.prototype.takeHit = function (Hit_Value, Damage_MAX) {
            this.isHit = true;
            this.frameIndex = 0;
            if (this.damageBar + Hit_Value < Damage_MAX) {
                this.damageBar += Hit_Value;
            }
            else {
                this.damageBar = 0;
            }
        };
        return Ship;
    }());
    engine.models.ship = ship;
}(engine));