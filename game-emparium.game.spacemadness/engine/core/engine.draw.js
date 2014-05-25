var engine, common;
(function(engine) {
    //'use strict';
    var cglbl,
        DEBUG = false,
        draw = (function() {

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
        if (cglbl.frameCounter % 1200 === 0 && cglbl.backGroundProgress < 10) {
            cglbl.backGroundProgress += 2;
        }

        cglbl.backgroundVelocity += cglbl.backGroundSpeed;

        cglbl.context.drawImage(cglbl.imageObjBackground, 0, (-1 * (cglbl.imageObjBackground.height - cglbl.backgroundVelocity)));
        this.core.globals.context.drawImage(this.core.globals.imageObjBackground, 0, this.core.globals.backgroundVelocity);
    };

    draw.prototype.drawLifeBar = function() {

        var leader = 489 - cglbl.player1Ship.health + 100;
        var wingman = 489 - cglbl.player2Ship.health + 100;

        //draw bar Frame
        cglbl.context.beginPath();
        cglbl.context.moveTo(10, 100);
        cglbl.context.lineTo(10, 490);
        cglbl.context.lineTo(30, 490);
        cglbl.context.lineTo(30, 100);
        cglbl.context.lineTo(10, 100);
        cglbl.context.moveTo(870, 100);
        cglbl.context.lineTo(870, 490);
        cglbl.context.lineTo(890, 490);
        cglbl.context.lineTo(890, 100);
        cglbl.context.lineTo(870, 100);

        cglbl.context.closePath();
        cglbl.context.lineWidth = 5;
        cglbl.context.strokeStyle = 'blue';
        cglbl.context.stroke();

        //draw life bar
        cglbl.context.beginPath();
        cglbl.context.moveTo(11, 489); //start
        cglbl.context.lineTo(29, 489); //left
        cglbl.context.lineTo(29, leader); //footer
        cglbl.context.lineTo(11, leader); //right
        cglbl.context.lineTo(11, 489); //head
        cglbl.context.fillStyle = "rgba(255,0,0,0.5)";
        cglbl.context.fill();
        cglbl.context.closePath();
        cglbl.context.moveTo(871, 489); //start
        cglbl.context.lineTo(889, 489); //left
        cglbl.context.lineTo(889, wingman); //footer
        cglbl.context.lineTo(871, wingman); //right
        cglbl.context.lineTo(871, 489); //head
        cglbl.context.fillStyle = "rgba(255,0,0,0.5)";
        cglbl.context.fill();
        cglbl.context.closePath();
    };

    draw.prototype.drawPlayers = function() {

        var leader = cglbl.player1Ship;
        var wingman = cglbl.player2Ship;
        var shipPosition;

        if (leader.isHit)
            this.drawExplosion(leader);
        else {
            shipPosition = leader.getPosition();
            cglbl.context.drawImage(leader.image, shipPosition.x, shipPosition.y, leader.width, leader.height);
        }

        if (wingman.isHit)
            this.drawExplosion(wingman);
        else {
            shipPosition = wingman.getPosition();
            cglbl.context.drawImage(wingman.image, shipPosition.x, shipPosition.y, wingman.width, wingman.height);
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
        this.drawLifeBar(cglbl.player2Ship.health, 2);
        this.drawLifeBar(cglbl.player1Ship.health, 1);
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

            if (DEBUG) {
                //draw hit area
                cglbl.context.beginPath();
                cglbl.context.arc(cglbl.rocksArr[i].x, cglbl.rocksArr[i].y, (cglbl.rocksArr[i].width / 2) - 3, 0, 2 *
                    Math.PI, false);
                cglbl.context.fillStyle = "rgba(255,255,0,0.2)";
                cglbl.context.closePath();
                cglbl.context.fill();

                //draw center
                cglbl.context.beginPath();
                cglbl.context.fillStyle = "rgba(255,0,0,1.5)";
                // cglbl.context.arc(cglbl.rocksArr[i].x, cglbl.rocksArr[i].y, 3, 0, 2 * Math.PI, false);
                cglbl.context.fillRect(cglbl.rocksArr[i].x, cglbl.rocksArr[i].y, 5, 5);
                cglbl.context.closePath();
                cglbl.context.fill();

                //draw distance
                // if (cglbl.player1Ship.life > 0) {
                cglbl.context.beginPath();
                cglbl.context.fillStyle = "rgba(255,255,255,1.5)";
                cglbl.context.font = 'italic bold ' + 15 + 'px sans-serif';
                cglbl.context.textBaseline = 'center';
                cglbl.context.fillText(cglbl.rocksArr[i].distance, cglbl.rocksArr[i].x - 40, cglbl.rocksArr[i].y +
                    10);
                cglbl.context.closePath();
                cglbl.context.fill();
                // }

                //draw X,Y
                cglbl.context.beginPath();
                cglbl.context.fillStyle = "rgba(255,125,0,1.5)";
                cglbl.context.font = 'italic bold 15px sans-serif';
                cglbl.context.textBaseline = 'center';
                cglbl.context.fillText(cglbl.rocksArr[i].x + "," + cglbl.rocksArr[i].y, cglbl.rocksArr[i].x + 20,
                    cglbl.rocksArr[i].y - 10);
                cglbl.context.closePath();
                cglbl.context.fill();
            }


            if (cglbl.rocksArr[i].y > 550) {
                this.core.ws.publish("getNewRock", {
                    index: i
                });
            } else {
                cglbl.rocksArr[i].y = cglbl.rocksArr[i].y + cglbl.rocksArr[i].speed;
                cglbl.rocksArr[i].center.y = cglbl.rocksArr[i].center.y + cglbl.rocksArr[i].speed;
            }
        }
    };

    draw.prototype.drawExplosion = function(ship) {
        var imageObj = new Image(),
            shipPos = ship.getPosition();
        if (ship.frameIndex < cglbl.explosionArray.length) {
            imageObj.src = cglbl.explosionArray[ship.frameIndex];
            cglbl.context.drawImage(imageObj, shipPos.x - 30, shipPos.y - 30);
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

    draw.prototype.drawText = function() {
        cglbl.context.fillStyle = "rgba(255,0,0,0.5)";
        cglbl.context.font = 'italic bold 35px sans-serif';
        cglbl.context.textBaseline = 'bottom';
        cglbl.context.fillText(cglbl.onScreenText, cglbl.canvas.clientWidth / 2, 50);
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
