var engine, common;
(function(engine) {
    //'use strict';
    var
    DEBUG = false,
        draw = (function(core) {

            function draw(velocity) {
                var _imageRock = new Image(),
                    _imageBonus = new Image(),
                    _imageObjBackground = new Image(),
                    _canvas = null,
                    _context = null,
                    _explosionArray = new Array(),
                    _backGroundSpeed = 0,
                    _velocity = velocity,
                    _socket = null,
                    _toRadians = Math.PI / 180,
                    _onScreenText = "",
                    _frameCounter = 0,
                    _countdownTimer = 3,
                    _c = null;

                this.init = function(state) {
                    _imageRock.src = "Images/asteroid.png";
                    _imageBonus.src = "Images/bonus1.png";
                    _imageObjBackground.src = "Images/space_background.jpg";
                    _canvas = document.getElementById('myCanvas');
                    _context = _canvas.getContext('2d');

                    var i, j = 0;

                    for (i = 0; i < 7 * 5; i++) {
                        _explosionArray[i] = "Images/Frames/e" + (j + 1) + ".png";
                        if (i % 5 === 0) {
                            j++;
                        }
                    }
                    _c = state;
                };

                this.run = function() {
                    _frameCounter++;
                    drawBackround();
                    drawTimer();
                    drawScores();
                    drawRocks();
                    drawItems();
                    drawLifeBar();
                    drawPlayers();
                    drawText();
                };

                this.setSocket = function(socket) {
                    _socket = socket;
                };

                function drawBackround() {

                    _context.clearRect(0, 0, _canvas.width, _canvas.height);

                    if (_velocity >= _imageObjBackground.height) {
                        _velocity = 0;
                    }

                    //increase Speed
                    if (_frameCounter % 1200 === 0 && _backGroundSpeed < 10) {
                        _backGroundSpeed += 2;
                    }

                    _velocity += _backGroundSpeed;

                    _context.drawImage(_imageObjBackground, 0, (-1 * (_imageObjBackground.height - _velocity)));
                    _context.drawImage(_imageObjBackground, 0, _velocity);
                };

                function drawLifeBar() {

                    var leader = 489 - _c._player1.health + 100;
                    var wingman = 489 - _c._player2.health + 100;

                    //draw bar Frame
                    _context.beginPath();
                    _context.moveTo(10, 100);
                    _context.lineTo(10, 490);
                    _context.lineTo(30, 490);
                    _context.lineTo(30, 100);
                    _context.lineTo(10, 100);
                    _context.moveTo(870, 100);
                    _context.lineTo(870, 490);
                    _context.lineTo(890, 490);
                    _context.lineTo(890, 100);
                    _context.lineTo(870, 100);

                    _context.closePath();
                    _context.lineWidth = 5;
                    _context.strokeStyle = 'blue';
                    _context.stroke();

                    //draw life bar
                    _context.beginPath();
                    _context.moveTo(11, 489); //start
                    _context.lineTo(29, 489); //left
                    _context.lineTo(29, leader); //footer
                    _context.lineTo(11, leader); //right
                    _context.lineTo(11, 489); //head
                    _context.fillStyle = "rgba(255,0,0,0.5)";
                    _context.fill();
                    _context.closePath();
                    _context.moveTo(871, 489); //start
                    _context.lineTo(889, 489); //left
                    _context.lineTo(889, wingman); //footer
                    _context.lineTo(871, wingman); //right
                    _context.lineTo(871, 489); //head
                    _context.fillStyle = "rgba(255,0,0,0.5)";
                    _context.fill();
                    _context.closePath();
                };

                function drawPlayers() {
                    if (_c.IsSquadLeader) {
                        _c._player1.image.src = 'Images/spaceship2.png';
                        _c._player2.image.src = 'Images/spaceship1.png';

                        var oldPos = _c._player1.getPosition();
                        _c._player1.getPosition().x = _c._player2.getPosition().x;
                        _c._player1.getPosition().y = _c._player2.getPosition().y;
                        _c._player2.getPosition().x = oldPos.x;
                        _c._player2.getPosition().y = oldPos.y;

                    }

                    if (_c._player1.isHit)
                        drawExplosion(_c._player1);
                    else {
                        shipPosition = _c._player1.getPosition();
                        _context.drawImage(_c._player1.image, shipPosition.x, shipPosition.y, _c._player1.width, _c._player1.height);
                    }

                    if (_c._player2.isHit)
                        drawExplosion(_c._player2);
                    else {
                        shipPosition = _c._player2.getPosition();
                        _context.drawImage(_c._player2.image, shipPosition.x, shipPosition.y, _c._player2.width, _c._player2.height);
                    }
                };

                function drawScores() {
                    _context.fillStyle = "rgba(255,0,0,0.5)";
                    _context.font = 'italic bold 30px sans-serif';
                    _context.textBaseline = 'bottom';
                    _context.fillText(_c.scores.score1, 60, 35);
                    _context.fillText(_c.scores.score2, 780, 35);
                };

                function drawTimer() {
                    if (_frameCounter % 60 == 0 && _countdownTimer >= 0) {
                        _countdownTimer--;
                        if (_countdownTimer === 0) {
                            _socket.publish("gameOn", {});
                            _backGroundSpeed = 2;
                            _c._player1.helmslock = false;
                            _c._player2.helmslock = false;
                        }
                    }

                    if (!_c.gameOn) {
                        _context.fillStyle = "rgba(255,0,0,0.5)";
                        _context.font = 'italic bold 70px sans-serif';
                        _context.textBaseline = 'bottom';
                        _context.fillText(_countdownTimer, 430, 280);
                    }
                };

                function drawItems() {
                    if (_c.itemArr) {
                        var i;
                        for (i = _c.itemArr.length - 1; i >= 0; i--) {
                            if (_c.itemArr[i].timeout > 0) {
                                _context.drawImage(_imageBonus, _c.itemArr[i].x, _c.itemArr[i].y);
                                _c.itemArr[i].timeout--;
                            }
                        }

                    }
                };

                function drawRocks() {
                    if (_c.rocksArr) {
                        var i = 0;
                        for (i; i < _c.rocksArr.length; ++i) {
                            drawRotatedImage(_imageRock, _c.rocksArr[i]);
                            _c.rocksArr[i].angle += _c.rocksArr[i].rotationSpeed;

                            if (DEBUG) {
                                //draw hit area
                                _context.beginPath();
                                _context.arc(_c.rocksArr[i].x, _c.rocksArr[i].y, (_c.rocksArr[i].width / 2) - 3, 0, 2 *
                                    Math.PI, false);
                                _context.fillStyle = "rgba(255,255,0,0.2)";
                                _context.closePath();
                                _context.fill();

                                //draw center
                                _context.beginPath();
                                _context.fillStyle = "rgba(255,0,0,1.5)";
                                // _context.arc(_c.rocksArr[i].x, _c.rocksArr[i].y, 3, 0, 2 * Math.PI, false);
                                _context.fillRect(_c.rocksArr[i].x, _c.rocksArr[i].y, 5, 5);
                                _context.closePath();
                                _context.fill();

                                //draw distance
                                // if (_c._player1.life > 0) {
                                _context.beginPath();
                                _context.fillStyle = "rgba(255,255,255,1.5)";
                                _context.font = 'italic bold ' + 15 + 'px sans-serif';
                                _context.textBaseline = 'center';
                                _context.fillText(_c.rocksArr[i].distance, _c.rocksArr[i].x - 40, _c.rocksArr[i].y +
                                    10);
                                _context.closePath();
                                _context.fill();
                                // }

                                //draw X,Y
                                _context.beginPath();
                                _context.fillStyle = "rgba(255,125,0,1.5)";
                                _context.font = 'italic bold 15px sans-serif';
                                _context.textBaseline = 'center';
                                _context.fillText(_c.rocksArr[i].x + "," + _c.rocksArr[i].y, _c.rocksArr[i].x + 20, _c.rocksArr[i].y - 10);
                                _context.closePath();
                                _context.fill();
                            }


                            if (_c.rocksArr[i].y > 550) {
                                _socket.publish("getNewRock", {
                                    index: i
                                });
                            } else {
                                _c.rocksArr[i].y = _c.rocksArr[i].y + _c.rocksArr[i].speed;
                                _c.rocksArr[i].center.y = _c.rocksArr[i].cen
                            }
                        }
                    }
                };

                function drawExplosion(ship) {
                    var imageObj = new Image(),
                        shipPos = ship.getPosition();
                    if (ship.frameIndex < _explosionArray.length) {
                        imageObj.src = _explosionArray[ship.frameIndex];
                        _context.drawImage(imageObj, shipPos.x - 30, shipPos.y - 30);
                        ship.frameIndex++;
                    } else {
                        ship.isHit = false;
                    }
                };

                function drawShipTransform(ship) {
                    if (ship.frameIndex < shipTransform.length) {
                        _context.drawImage(shipTransform[ship.frameIndex].image, ship.x, ship.y, 120, 120);
                        ship.frameIndex++;
                    } else {
                        ship.Transform = false;
                    }
                };

                function drawText() {
                    _context.fillStyle = "rgba(255,0,0,0.5)";
                    _context.font = 'italic bold 35px sans-serif';
                    _context.textBaseline = 'bottom';
                    _context.fillText(_c.onScreenText, _canvas.clientWidth / 2, 50);
                };

                function drawRotatedImage(image, obj) {

                    // save the current co-ordinate system 
                    // before we screw with it
                    _context.save();

                    // move to the middle of where we want to draw our image
                    _context.translate(obj.x, obj.y);

                    // rotate around that point, converting our 
                    // angle from degrees to radians 
                    _context.rotate(obj.angle * _toRadians);

                    // draw it up and to the left by half the width
                    // and height of the image 
                    _context.drawImage(image, -(image.width / 2), -(image.height / 2), obj.width, obj.height);

                    // and restore the co-ords to how they were when we began
                    _context.restore();
                };

            };
            return draw;
        }());






    engine.draw = draw;

}(engine));
