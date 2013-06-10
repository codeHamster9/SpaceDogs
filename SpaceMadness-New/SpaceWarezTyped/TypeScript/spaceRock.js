/// <reference path="ICollidable.ts" />
var spaceRock = (function () {
    function spaceRock(rock) {
        this.x = rock.x;
        this.y = rock.y;
        this.speed = rock.speed;
        this.angle = rock.angle;
        this.rotationSpeed = rock.rotationSpeed;
        this.height = rock.height;
        this.width = rock.width;
        this.type = "rock";
    }
    return spaceRock;
})();
//@ sourceMappingURL=spaceRock.js.map
