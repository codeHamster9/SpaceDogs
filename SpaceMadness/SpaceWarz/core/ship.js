

(function (engine) {

    var ship = (function () {

        function SpaceShip(id, x, y, width, height) {
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
            this.fx = new effects.effectBase(); //effect Object
            this.image = new Image();
            this.Transform = {};
        }

        SpaceShip.prototype.applyEffect = function () {
            if (this.fx.duration >= 0) {
                this.fx.apply(this);
            }
        };

        SpaceShip.prototype.explode = function (rockIndex) {
            this.isHit = true;
            this.frameIndex = 0;
            this.takeHit();
            //hub.server.playerExplode(rockIndex);
        };

        SpaceShip.prototype.takeHit = function (Hit_Value, Damage_MAX) {
            this.isHit = true;
            this.frameIndex = 0;
            if (this.damageBar + Hit_Value < Damage_MAX) {
                this.damageBar += Hit_Value;
            }
            else {
                this.damageBar = 0;
            }
        };
        return SpaceShip;
    }());
    engine.ship = ship;
}(engine));