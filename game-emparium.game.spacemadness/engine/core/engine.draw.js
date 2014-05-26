var engine, common;
(function(engine) {
    //'use strict';
    var cglbl,
        DEBUG = false,
        draw = (function(globals) {

            function Draw(velocity, globals) {
                imageRock = new Image();
                imageBonus = new Image();
                imageObjBackground = new Image();
                canvas = null;
                context = null;
                _player1 = null;
                _player2 = null;
                _explosionArray = new Array();
                _backGroundSpeed = 2;
                _velocity = velocity;
                _socket = null;
                _toRadians = Math.PI / 180;
                cglbl = globals;

            }
            return Draw;
        }());

    draw.prototype.getCanvas = function() {
        return canvas;
    };

    draw.prototype.setSocket = function(socket) {
        _socket = socket;
    };

    draw.prototype.init = function() {

        imageRock.src = "Images/asteroid.png";
        imageBonus.src = "Images/bonus1.png";
        imageObjBackground.src = "Images/space_background.jpg";
        canvas = document.getElementById('myCanvas');
        context = canvas.getContext('2d');

        var i, j = 0;

        for (i = 0; i < 7 * 5; i++) {
            _explosionArray[i] = "Images/Frames/e" + (j + 1) + ".png";
            if (i % 5 === 0) {
                j++;
            }
        }
    };

    draw.prototype.setPlayers = function(player1, player2) {

        _player1 = player1;
        _player2 = player2;
    };

    draw.prototype.drawBackround = function() {

        context.clearRect(0, 0, canvas.width, canvas.height);

        if (_velocity >= imageObjBackground.height) {
            _velocity = 0;
        }

        //increase Speed
        if (cglbl.frameCounter % 1200 === 0 && cglbl.backGroundProgress < 10) {
            _backGroundSpeed += 2;
        }

        _velocity += _backGroundSpeed;

        context.drawImage(imageObjBackground, 0, (-1 * (imageObjBackground.height - _velocity)));
        context.drawImage(imageObjBackground, 0, _velocity);
    };

    draw.prototype.drawLifeBar = function() {

        var leader = 489 - _player1.health + 100;
        var wingman = 489 - _player2.health + 100;

        //draw bar Frame
        context.beginPath();
        context.moveTo(10, 100);
        context.lineTo(10, 490);
        context.lineTo(30, 490);
        context.lineTo(30, 100);
        context.lineTo(10, 100);
        context.moveTo(870, 100);
        context.lineTo(870, 490);
        context.lineTo(890, 490);
        context.lineTo(890, 100);
        context.lineTo(870, 100);

        context.closePath();
        context.lineWidth = 5;
        context.strokeStyle = 'blue';
        context.stroke();

        //draw life bar
        context.beginPath();
        context.moveTo(11, 489); //start
        context.lineTo(29, 489); //left
        context.lineTo(29, leader); //footer
        context.lineTo(11, leader); //right
        context.lineTo(11, 489); //head
        context.fillStyle = "rgba(255,0,0,0.5)";
        context.fill();
        context.closePath();
        context.moveTo(871, 489); //start
        context.lineTo(889, 489); //left
        context.lineTo(889, wingman); //footer
        context.lineTo(871, wingman); //right
        context.lineTo(871, 489); //head
        context.fillStyle = "rgba(255,0,0,0.5)";
        context.fill();
        context.closePath();
    };

    draw.prototype.drawPlayers = function() {

        var leader = _player1;
        var wingman = _player2;
        var shipPosition;

        if (leader.isHit)
            this.drawExplosion(leader);
        else {
            shipPosition = leader.getPosition();
            context.drawImage(leader.image, shipPosition.x, shipPosition.y, leader.width, leader.height);
        }

        if (wingman.isHit)
            this.drawExplosion(wingman);
        else {
            shipPosition = wingman.getPosition();
            context.drawImage(wingman.image, shipPosition.x, shipPosition.y, wingman.width, wingman.height);
        }
    };

    draw.prototype.drawScores = function(player1, player2) {
        context.fillStyle = "rgba(255,0,0,0.5)";
        context.font = 'italic bold 30px sans-serif';
        context.textBaseline = 'bottom';
        context.fillText(player1, 60, 35);
        context.fillText(player2, 780, 35);
    };

    draw.prototype.drawTimer = function(value) {
        // draw background and both players
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(imageObjBackground, 0, 0);
        this.drawLifeBar(_player2.health, 2);
        this.drawLifeBar(_player1.health, 1);
        this.drawPlayer(_player1);
        this.drawPlayer(_player2);
        context.fillStyle = "rgba(255,0,0,0.5)";
        context.font = 'italic bold 70px sans-serif';
        context.textBaseline = 'bottom';
        context.fillText(value, 430, 280);
    };

    draw.prototype.drawBonus = function() {
        var i;
        for (i = cglbl.bonusArr.length - 1; i >= 0; i--) {
            if (cglbl.bonusArr[i].timeout > 0) {
                context.drawImage(imageBonus, cglbl.bonusArr[i].x, cglbl.bonusArr[i].y);
                cglbl.bonusArr[i].timeout--;
            }
        }
    };

    draw.prototype.drawRocks = function() {
        var i = 0;
        for (i; i < cglbl.rocksArr.length; ++i) {
            this.drawRotatedImage(imageRock, cglbl.rocksArr[i]);
            cglbl.rocksArr[i].angle += cglbl.rocksArr[i].rotationSpeed;

            if (DEBUG) {
                //draw hit area
                context.beginPath();
                context.arc(cglbl.rocksArr[i].x, cglbl.rocksArr[i].y, (cglbl.rocksArr[i].width / 2) - 3, 0, 2 *
                    Math.PI, false);
                context.fillStyle = "rgba(255,255,0,0.2)";
                context.closePath();
                context.fill();

                //draw center
                context.beginPath();
                context.fillStyle = "rgba(255,0,0,1.5)";
                // context.arc(cglbl.rocksArr[i].x, cglbl.rocksArr[i].y, 3, 0, 2 * Math.PI, false);
                context.fillRect(cglbl.rocksArr[i].x, cglbl.rocksArr[i].y, 5, 5);
                context.closePath();
                context.fill();

                //draw distance
                // if (_player1.life > 0) {
                context.beginPath();
                context.fillStyle = "rgba(255,255,255,1.5)";
                context.font = 'italic bold ' + 15 + 'px sans-serif';
                context.textBaseline = 'center';
                context.fillText(cglbl.rocksArr[i].distance, cglbl.rocksArr[i].x - 40, cglbl.rocksArr[i].y +
                    10);
                context.closePath();
                context.fill();
                // }

                //draw X,Y
                context.beginPath();
                context.fillStyle = "rgba(255,125,0,1.5)";
                context.font = 'italic bold 15px sans-serif';
                context.textBaseline = 'center';
                context.fillText(cglbl.rocksArr[i].x + "," + cglbl.rocksArr[i].y, cglbl.rocksArr[i].x + 20,
                    cglbl.rocksArr[i].y - 10);
                context.closePath();
                context.fill();
            }


            if (cglbl.rocksArr[i].y > 550) {
                _socket.publish("getNewRock", {
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
        if (ship.frameIndex < _explosionArray.length) {
            imageObj.src = _explosionArray[ship.frameIndex];
            context.drawImage(imageObj, shipPos.x - 30, shipPos.y - 30);
            ship.frameIndex++;
        } else {
            ship.isHit = false;
        }
    };

    draw.prototype.drawShipTransform = function(ship) {
        if (ship.frameIndex < cglbl.shipTransform.length) {
            context.drawImage(cglbl.shipTransform[ship.frameIndex].image, ship.x, ship.y, 120, 120);
            ship.frameIndex++;
        } else {
            ship.Transform = false;
        }
    };

    draw.prototype.drawText = function() {
        context.fillStyle = "rgba(255,0,0,0.5)";
        context.font = 'italic bold 35px sans-serif';
        context.textBaseline = 'bottom';
        context.fillText(cglbl.onScreenText, canvas.clientWidth / 2, 50);
    };

    draw.prototype.drawRotatedImage = function(image, obj) {

        // save the current co-ordinate system 
        // before we screw with it
        context.save();

        // move to the middle of where we want to draw our image
        context.translate(obj.x, obj.y);

        // rotate around that point, converting our 
        // angle from degrees to radians 
        context.rotate(obj.angle * _toRadians);

        // draw it up and to the left by half the width
        // and height of the image 
        context.drawImage(image, -(image.width / 2), -(image.height / 2), obj.width, obj.height);

        // and restore the co-ords to how they were when we began
        context.restore();
    };

    engine.draw = draw;

}(engine));
