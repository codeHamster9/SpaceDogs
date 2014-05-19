'use strict';
var engine;
(function (engine) {
    var rock = (function (rock) {
        function Rock(rock) {
            this.x = rock.x;
            this.y = rock.y;
            this.speed = rock.speed;
            this.angle = rock.angle;
            this.rotationSpeed = rock.rotationSpeed;
            this.width = rock.width;
            this.height = rock.height;
        }
        return Rock;
    }(engine.rock));
    engine.rock = rock;
}(engine));