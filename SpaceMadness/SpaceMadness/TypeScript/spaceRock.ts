/// <reference path="ICollidable.ts" />

class spaceRock implements ICollidable {
    x: number;
    y: number;
    speed: number;
    angle: number;
    rotationSpeed: number;
    height: number;
    width: number;
    index: number;
    type: string;
    distance: number;

    constructor(rock: spaceRock) {
        this.x = rock.x;
        this.y = rock.y;
        this.speed = rock.speed;
        this.angle = rock.angle;
        this.rotationSpeed = rock.rotationSpeed;
        this.height = rock.height;
        this.width = rock.width;
        this.type = "rock";
    }
}