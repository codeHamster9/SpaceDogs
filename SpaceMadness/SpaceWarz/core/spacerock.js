
var engine;
(function (engine) {
    var spaceRock = (function (rock) {
        function SpaceRock(rock) {
            this.x = rock.x;
            this.y = rock.y;
            this.speed = rock.speed;
            this.angle = rock.angle;
            this.rotationSpeed = rock.rotationSpeed;
            this.width = rock.width;
            this.height = rock.height;
        }
        return SpaceRock;
    }(engine.spaceRock));
    engine.spaceRock = spaceRock;
}(engine));