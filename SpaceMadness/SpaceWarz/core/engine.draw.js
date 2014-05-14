var engine;
(function (engine) {
    'use strict';

    var draw = (function () {

        function Draw(core) {
            this.core = core;
        }

        return Draw;
    }());

    draw.prototype.drawBackround = function () {
        this.core.context.clearRect(0, 0, this.core.globals.canvas.width, this.core.globals.canvas.height);
        this.core.context.drawImage(this.core.globals.imageObjBackground, 0, this.core.globals.backgroundVelocity);
        if (this.core.globals.backgroundVelocity > this.core.globals.imageObjBackground.height) {
            this.core.globals.backgroundVelocity = 0;
        }
        this.core.globals.backgroundVelocity += this.core.globals.backGroundSpeed;
    };

    draw.prototype.drawLifeBar = function (minLifeBar, playerIndex) {
        var y = 100 + minLifeBar;
        //draw bar Frame
        this.core.globals.context.beginPath();
        if (playerIndex === 1) {
            this.core.globals.context.moveTo(10, 100);
            this.core.globals.context.lineTo(10, 490);
            this.core.globals.context.lineTo(30, 490);
            this.core.globals.context.lineTo(30, 100);
            this.core.globals.context.lineTo(10, 100);
        } else {
            this.core.globals.context.moveTo(870, 100);
            this.core.globals.context.lineTo(870, 490);
            this.core.globals.context.lineTo(890, 490);
            this.core.globals.context.lineTo(890, 100);
            this.core.globals.context.lineTo(870, 100);
        }
        this.core.globals.context.closePath();
        this.core.globals.context.lineWidth = 5;
        this.core.globals.context.strokeStyle = 'blue';
        this.core.globals.context.stroke();

        //draw life bar
        this.core.globals.context.beginPath();
        if (playerIndex === 1) {
            this.core.globals.context.moveTo(11, y); //start
            this.core.globals.context.lineTo(11, 489); //left
            this.core.globals.context.lineTo(29, 489); //footer
            this.core.globals.context.lineTo(29, y); //right
            this.core.globals.context.lineTo(11, y); //head
        } else {
            this.core.globals.context.moveTo(871, y); //start
            this.core.globals.context.lineTo(871, 489); //left
            this.core.globals.context.lineTo(889, 489); //footer
            this.core.globals.context.lineTo(889, y); //right
            this.core.globals.context.lineTo(871, y); //head
        }

        this.core.globals.context.fillStyle = "rgba(255,0,0,0.5)";
        this.core.globals.context.fill();
        this.core.globals.context.closePath();
    };

    draw.prototype.drawPlayer = function (ship) {
        if (ship.isHit) {
            this.drawExplosion(ship);
        } else {
            this.core.globals.context.drawImage(ship.image, ship.x, ship.y, ship.width, ship.height);
        }
        if (ship.Transform) {

            this.drawShipTransform(ship);

        }
    };

    draw.prototype.drawScores = function () {
        this.core.globals.context.fillStyle = "rgba(255,0,0,0.5)";
        this.core.globals.context.font = 'italic bold 30px sans-serif';
        this.core.globals.context.textBaseline = 'bottom';
        this.core.globals.context.fillText(this.core.globals.scorePlayer1, 60, 35);
        this.core.globals.context.fillText(this.core.globals.scorePlayer2, 780, 35);
    };

    draw.prototype.drawTimer = function (value) {
        // draw background and both players
        this.core.globals.context.clearRect(0, 0, this.core.globals.canvas.width, this.core.globals.canvas.height);
        this.core.globals.context.drawImage(this.core.globals.imageObjBackground, 0, 0);
        this.drawLifeBar(this.core.globals.player2Ship.damageBar, 2);
        this.drawLifeBar(this.core.globals.player1Ship.damageBar, 1);
        this.drawPlayer(this.core.globals.player1Ship);
        this.drawPlayer(this.core.globals.player2Ship);
        this.core.globals.context.fillStyle = "rgba(255,0,0,0.5)";
        this.core.globals.context.font = 'italic bold 70px sans-serif';
        this.core.globals.context.textBaseline = 'bottom';
        this.core.globals.context.fillText(value, 430, 280);
    };

    draw.prototype.drawBonus = function () {

        $.each(this.core.globals.bonusArr, function (index, bonusItem) {
            if (bonusItem.timeout > 0) {
                this.core.globals.context.drawImage(this.core.globals.imageBonus, bonusItem.x, bonusItem.y);
                bonusItem.timeout--;
            }
        });
    };

    draw.prototype.drawRocks = function () {
        var i = 0;
        for (i; i < this.core.globals.rocksArr.length; ++i) {
            this.drawRotatedImage(this.core.globals.imageRock, this.core.globals.rockArr[i]);
            this.core.globals.rocksArr[i].angle += this.core.globals.rocksArr[i].rotationSpeed;
            if (this.core.globals.rocksArr[i].y > 500) {
                this.core.hub.server.initRock(i);
            } else {
                this.core.globals.rocksArr[i].y = this.core.globals.rocksArr[i].y + this.core.globals.rocksArr[i].speed;
            }
        }
    };

    draw.prototype.drawExplosion = function (ship) {
        if (ship.frameIndex < this.core.globals.explosionArray.length) {
            this.core.globals.context.drawImage(this.core.globals.explosionArray[ship.frameIndex].image, ship.x - 30, ship.y - 30);
            ship.frameIndex++;
        } else {
            ship.isHit = false;
        }
    };

    draw.prototype.drawShipTransform = function (ship) {
        if (ship.frameIndex < this.shipTransform.length) {
            this.core.globals.context.drawImage(this.shipTransform[ship.frameIndex].image, ship.x, ship.y, 120, 120);
            ship.frameIndex++;
        } else {
            ship.Transform = false;
        }
    };

    draw.prototype.drawText = function (txt) {
        this.core.globals.context.fillStyle = "rgba(255,0,0,0.5)";
        this.core.globals.context.font = 'italic bold 35px sans-serif';
        this.core.globals.context.textBaseline = 'bottom';
        this.core.globals.context.fillText(txt, this.core.globals.canvas.clientWidth / 2, 50);
    };

    draw.prototype.drawRotatedImage = function (image, obj) {

        // save the current co-ordinate system 
        // before we screw with it
        this.core.globals.context.save();

        // move to the middle of where we want to draw our image
        this.core.globals.context.translate(obj.x, obj.y);

        // rotate around that point, converting our 
        // angle from degrees to radians 
        this.core.globals.context.rotate(obj.angle * this.core.globals.TO_RADIANS);

        // draw it up and to the left by half the width
        // and height of the image 
        this.core.globals.context.drawImage(image, -(image.width / 2), -(image.height / 2), obj.width, obj.height);

        // and restore the co-ords to how they were when we began
        this.core.globals.context.restore();
    };

    engine.draw = draw;

}(engine));
