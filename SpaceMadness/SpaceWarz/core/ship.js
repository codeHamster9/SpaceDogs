function spaceShip() {
    this.id;
    this.x;
    this.y;
    this.oldX;
    this.oldY;
    this.width;
    this.height;
    this.image = new Image();
    this.damageBar;
    this.isHit;
    this.frameIndex;
    this.isUnderEffect;
    this.shieldsUp;
    this.fx; //effect Object
    this.Transform;
    this.applyEffect = function () {
        if (this.fx.duration >= 0)
            this.fx.apply(this);
    };
    this.explode = function (rockIndex) {
        this.isHit = true;
        this.frameIndex = 0;
        this.takeHit();
        hub.server.playerExplode(rockIndex);
    };
    this.takeHit = function () {
        this.isHit = true;
        this.frameIndex = 0;
        if (this.damageBar + Hit_Value < Damage_MAX) {
            this.damageBar += Hit_Value;
        }
        else {
            this.damageBar = 0;
        }
    }
}