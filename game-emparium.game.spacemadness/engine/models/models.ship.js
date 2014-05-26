//'use strict';

(function(engine) {

    var ship = (function() {

        function Ship(id, x, y, width, height, url) {
            var _id = id,
                _oldX = x,
                _oldY = y,
                _x = x,
                _y = y,
                _url = url;


            this.getPosition = function() {
                return {
                    x: _x,
                    y: _y
                };
            };

            this.moveVertical = function(move) {
                _y = move;
                _oldY = move;
            };

            this.moveHorizontl = function(move) {
                _x = move;
                _oldX = move;
            };

            this.getShipCenter = function() {
                return {
                    x: (_x + (this.width / 2)),
                    y: (_y + (this.height / 2))
                };
            };

            this.width = width;
            this.height = height;
            this.type = "Ship";
            this.helmslock = false;
            this.health = 489;
            this.frameIndex = 0;
            this.isHit = false;
            this.isUnderEffect = false;
            this.shieldsUp = false;
            this.fx = null; //effect Object
            this.image = (function() {
                var img = new Image();
                img.src = _url;
                return img;
            }());
            this.Transform = {};
        }



        Ship.prototype.applyEffect = function() {
            if (this.fx.duration >= 0) {
                this.fx.apply(this);
            }
        };

        Ship.prototype.explode = function() {
            this.isHit = true;
            this.frameIndex = 0;
            this.takeHit();
        };

        Ship.prototype.takeHit = function(hit) {
            this.isHit = true;
            this.frameIndex = 0;
            if (this.health - hit > 0) {
                this.health -= hit;
            } else {
                this.health = 489;
            }
        };
        return Ship;
    }());
    engine.models.ship = ship;
}(engine));
