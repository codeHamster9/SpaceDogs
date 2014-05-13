/// <reference path="Effects/effectBase.ts" />
/// <reference path="ICollidable.ts" />

class spaceShip implements ICollidable {
    id: string;
    x: number;
    y: number;
    oldX: number;
    oldY: number;
    width: number;
    height: number;
    image: HTMLImageElement;
    damageBar: number;
    isHit: boolean;
    frameIndex: number;
    isUnderEffect: boolean;
    shieldsUp: boolean;
    fx: effects.effectBase;
    Transform: boolean;
    originalWidth: number;
    originalHeight: number;
    isDead: boolean;
    life: number;
    type: string;
    isHelmsLocked: boolean;
    distance: number;

    constructor(id: string, imageURL: string, _x: number, _y: number) {
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

    applyEffect() {
         if (this.fx.duration >= 0)
                this.fx.apply(this);
    }

    explode() {
        this.isHit = true;
        this.frameIndex = 0;
        this.takeHit();
    }

    takeHit() {
        this.isHit = true;
        this.frameIndex = 0;
        if (this.damageBar + 35 < 420) {
            this.damageBar += 35;
        }
        else {
            this.isDead = true;
            this.life--;
            this.damageBar = 0;
        }
    }
};