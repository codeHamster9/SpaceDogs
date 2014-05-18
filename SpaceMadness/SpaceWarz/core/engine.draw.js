var engine;
(function(engine) {
        'use strict';
        var cglbl;
        var draw = (function() {

            function Draw(core) {
                this.core = core;
                cglbl = core.globals;
            }

            return Draw;
        }());

        draw.prototype.drawBackround = function() {

            cglbl.context.clearRect(0, 0, cglbl.canvas.width, cglbl.canvas.height);

            if (cglbl.backgroundVelocity >= cglbl.imageObjBackground.height) {
                cglbl.backgroundVelocity = 0;
            }

            //increase Speed
            if (cglbl.frameCounter % 1200 == 0 && cglbl.backGroundProgress < 10) {
                cglbl.backGroundProgress += 2;
            }

            cglbl.backgroundVelocity += cglbl.backGroundSpeed;

            cglbl.context.drawImage(cglbl.imageObjBackground, 0, (-1 * (cglbl.imageObjBackground.height - cglbl.backgroundVelocity)));
            this.core.globals.context.drawImage(this.core.globals.imageObjBackground, 0, this.core.globals.backgroundVelocity);

    };

    draw.prototype.drawLifeBar = function(minLifeBar, playerIndex) {
        var y = 100 + minLifeBar;
        //draw bar Frame
        cglbl.context.beginPath();
        if (playerIndex === 1) {
            cglbl.context.moveTo(10, 100);
            cglbl.context.lineTo(10, 490);
            cglbl.context.lineTo(30, 490);
            cglbl.context.lineTo(30, 100);
            cglbl.context.lineTo(10, 100);
        } else {
            cglbl.context.moveTo(870, 100);
            cglbl.context.lineTo(870, 490);
            cglbl.context.lineTo(890, 490);
            cglbl.context.lineTo(890, 100);
            cglbl.context.lineTo(870, 100);
        }
        cglbl.context.closePath();
        cglbl.context.lineWidth = 5;
        cglbl.context.strokeStyle = 'blue';
        cglbl.context.stroke();

        //draw life bar
        cglbl.context.beginPath();
        if (playerIndex === 1) {
            cglbl.context.moveTo(11, y); //start
            cglbl.context.lineTo(11, 489); //left
            cglbl.context.lineTo(29, 489); //footer
            cglbl.context.lineTo(29, y); //right
            cglbl.context.lineTo(11, y); //head
        } else {
            cglbl.context.moveTo(871, y); //start
            cglbl.context.lineTo(871, 489); //left
            cglbl.context.lineTo(889, 489); //footer
            cglbl.context.lineTo(889, y); //right
            cglbl.context.lineTo(871, y); //head
        }

        cglbl.context.fillStyle = "rgba(255,0,0,0.5)";
        cglbl.context.fill();
        cglbl.context.closePath();
    };

    draw.prototype.drawPlayer = function(ship) {
        if (ship.isHit) {
            this.drawExplosion(ship);
        } else {
            cglbl.context.drawImage(ship.image, ship.x, ship.y, ship.width, ship.height);
        }
        if (ship.Transform) {

            this.drawShipTransform(ship);

        }
    };

    draw.prototype.drawScores = function() {
        cglbl.context.fillStyle = "rgba(255,0,0,0.5)";
        cglbl.context.font = 'italic bold 30px sans-serif';
        cglbl.context.textBaseline = 'bottom';
        cglbl.context.fillText(cglbl.scorePlayer1, 60, 35);
        cglbl.context.fillText(cglbl.scorePlayer2, 780, 35);
    };

    draw.prototype.drawTimer = function(value) {
        // draw background and both players
        cglbl.context.clearRect(0, 0, cglbl.canvas.width, cglbl.canvas.height);
        cglbl.context.drawImage(cglbl.imageObjBackground, 0, 0);
        this.drawLifeBar(cglbl.player2Ship.damageBar, 2);
        this.drawLifeBar(cglbl.player1Ship.damageBar, 1);
        this.drawPlayer(cglbl.player1Ship);
        this.drawPlayer(cglbl.player2Ship);
        cglbl.context.fillStyle = "rgba(255,0,0,0.5)";
        cglbl.context.font = 'italic bold 70px sans-serif';
        cglbl.context.textBaseline = 'bottom';
        cglbl.context.fillText(value, 430, 280);
    };

    draw.prototype.drawBonus = function() {
        var i;
        for (i = cglbl.bonusArr.length - 1; i >= 0; i--) {
            if (cglbl.bonusArr[i].timeout > 0) {
                cglbl.context.drawImage(cglbl.imageBonus, cglbl.bonusArr[i].x, cglbl.bonusArr[i].y);
                cglbl.bonusArr[i].timeout--;
            }
        }
    };

    draw.prototype.drawRocks = function() {
        var i = 0;
        for (i; i < cglbl.rocksArr.length; ++i) {
            this.drawRotatedImage(cglbl.imageRock, cglbl.rocksArr[i]);
            cglbl.rocksArr[i].angle += cglbl.rocksArr[i].rotationSpeed;
            if (cglbl.rocksArr[i].y > 500) {
                this.core.ws.publish("getNewRock", {
                    index: i
                });
            } else {
                cglbl.rocksArr[i].y = cglbl.rocksArr[i].y + cglbl.rocksArr[i].speed;
            }
        }
    };

    draw.prototype.drawExplosion = function(ship) {
        if (ship.frameIndex < cglbl.explosionArray.length) {
            cglbl.context.drawImage(cglbl.explosionArray[ship.frameIndex].image, ship.x - 30, ship.y - 30);
            ship.frameIndex++;
        } else {
            ship.isHit = false;
        }
    };

    draw.prototype.drawShipTransform = function(ship) {
        if (ship.frameIndex < cglbl.shipTransform.length) {
            cglbl.context.drawImage(cglbl.shipTransform[ship.frameIndex].image, ship.x, ship.y, 120, 120);
            ship.frameIndex++;
        } else {
            ship.Transform = false;
        }
    };

    draw.prototype.drawText = function(txt) {
        cglbl.context.fillStyle = "rgba(255,0,0,0.5)";
        cglbl.context.font = 'italic bold 35px sans-serif';
        cglbl.context.textBaseline = 'bottom';
        cglbl.context.fillText(txt, cglbl.canvas.clientWidth / 2, 50);
    };

    draw.prototype.drawRotatedImage = function(image, obj) {

        // save the current co-ordinate system 
        // before we screw with it
        cglbl.context.save();

        // move to the middle of where we want to draw our image
        cglbl.context.translate(obj.x, obj.y);

        // rotate around that point, converting our 
        // angle from degrees to radians 
        cglbl.context.rotate(obj.angle * cglbl.TO_RADIANS);

        // draw it up and to the left by half the width
        // and height of the image 
        cglbl.context.drawImage(image, -(image.width / 2), -(image.height / 2), obj.width, obj.height);

        // and restore the co-ords to how they were when we began
        cglbl.context.restore();
    };

    engine.draw = draw;

}(engine));
