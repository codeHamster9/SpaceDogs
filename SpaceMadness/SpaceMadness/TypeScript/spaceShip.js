/// <reference path="Effects/effectBase.ts" />
/// <reference path="ICollidable.ts" />
var spaceShip = (function () {
    function spaceShip(id, imageURL, _x, _y) {
        this.id = id;
        this.image = new Image();
        this.originalHeight = 50;
        this.originalWidth = 50;
        this.isHit = false;
        this.isUnderEffect = false;
        this.damageBar = 0;
        this.Transform = false;
        this.x = _x;
        this.y = _y;
        this.oldX = 0;
        this.oldY = 0;
        this.width = 50;
        this.height = 50;
        this.image.src = imageURL;
        this.isDead = false;
        this.life = 3;
        this.type = "ship";
        this.isHelmsLocked = false;
    }
    spaceShip.prototype.applyEffect = function () {
        if(this.fx.duration >= 0) {
            this.fx.apply(this);
        }
    };
    spaceShip.prototype.explode = function () {
        this.isHit = true;
        this.frameIndex = 0;
        this.takeHit();
    };
    spaceShip.prototype.takeHit = function () {
        this.isHit = true;
        this.frameIndex = 0;
        if(this.damageBar + 35 < 420) {
            this.damageBar += 35;
        } else {
            this.isDead = true;
            this.life--;
            this.damageBar = 0;
        }
    };
    return spaceShip;
})();
//@ sourceMappingURL=spaceShip.js.map
