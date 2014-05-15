
var engine;
(function (engine) {
    var spaceRock = (function () {
        function SpaceRock(x, y, speed, angle, rotationSpeed, width, height) {
            this.x = x;
            this.y = y;
            this.speed = speed;
            this.angle = angle;
            this.rotationSpeed = rotationSpeed;
            this.width = width;
            this.height = height;
        }
        return SpaceRock;
    }());
    engine.spaceRock = spaceRock;
}(engine));