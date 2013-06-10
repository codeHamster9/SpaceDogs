var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var effects;
(function (effects) {
    var effectBase = (function () {
        function effectBase(type, ship) {
            this.type = type;
            this.Type = type;
            this.duration = 420;
            this.ship = ship;
        }
        effectBase.prototype.apply = function (ship) {
        };
        effectBase.prototype.clearFX = function (ship) {
            ship.isUnderEffect = false;
            ship.fx = null;
            document.getElementById('myCanvas').textContent = "";
        };
        return effectBase;
    })();
    effects.effectBase = effectBase;    
    var drunkFx = (function (_super) {
        __extends(drunkFx, _super);
        function drunkFx(ship, alcoholLvl) {
                _super.call(this, "drunk", ship);
            this.amount = alcoholLvl;
            this.borderX = document.getElementById("myCanvas").clientWidth;
            this.borderY = document.getElementById("myCanvas").clientHeight;
            this.inverted = false;
        }
        drunkFx.prototype.apply = function (ship) {
            if(this.duration % 3 == 0) {
                var drunkX = Math.round(Math.random() * this.amount);
                var drunkY = Math.round(Math.random() * this.amount);
                if(!this.inverted) {
                    ship.x = ship.x + drunkX;
                    ship.y = ship.y + drunkY;
                    this.inverted = true;
                } else {
                    ship.x = ship.x - drunkX;
                    ship.y = ship.y - drunkY;
                    this.inverted = false;
                }
                ;
            }
            if(this.duration == 0) {
                this.clearFX(ship);
            }
            this.duration--;
        };
        return drunkFx;
    })(effectBase);
    effects.drunkFx = drunkFx;    
    var bumpFX = (function (_super) {
        __extends(bumpFX, _super);
        function bumpFX(ship, hitter) {
                _super.call(this, "bump", ship);
            this.borderX = document.getElementById("myCanvas").clientWidth;
            this.borderY = document.getElementById("myCanvas").clientHeight;
            this.duration = 8;
            this.role = hitter;
        }
        bumpFX.prototype.apply = function (ship) {
            if(ship.x < this.borderX) {
                if(this.role) {
                    ship.x = (ship.x + 3.5);
                } else {
                    ship.x = (ship.x - 3.5);
                }
            }
            if(this.duration == 0) {
                this.clearFX(ship);
            }
            this.duration--;
        };
        bumpFX.prototype.clearFX = function (ship) {
            ship.isUnderEffect = false;
            ship.fx = null;
        };
        return bumpFX;
    })(effectBase);
    effects.bumpFX = bumpFX;    
    var shieldFx = (function (_super) {
        __extends(shieldFx, _super);
        function shieldFx(ship) {
                _super.call(this, "shield", ship);
        }
        shieldFx.prototype.apply = function (ship) {
            ship.shieldsUp = true;
            if(this.duration == 0) {
                this.shieldDown(ship);
                this.clearFX(ship);
            }
            this.duration--;
        };
        shieldFx.prototype.shieldDown = function (ship) {
            ship.shieldsUp = false;
        };
        return shieldFx;
    })(effectBase);
    effects.shieldFx = shieldFx;    
    var shrinkFx = (function (_super) {
        __extends(shrinkFx, _super);
        function shrinkFx(ship) {
                _super.call(this, "shrink", ship);
            this.resizeLimit = 32;
        }
        shrinkFx.prototype.apply = function (ship) {
            if(this.duration > 30) {
                this.shrink(ship);
            } else {
                this.grow(ship);
            }
            this.duration--;
            if(this.duration == 0) {
                this.clearFX(ship);
            }
        };
        shrinkFx.prototype.shrink = function (ship) {
            if(ship.width >= this.resizeLimit) {
                ship.width--;
                ship.height--;
            }
        };
        shrinkFx.prototype.grow = function (ship) {
            if(ship.width < ship.originalWidth) {
                ship.width++;
                ship.height++;
            }
        };
        shrinkFx.prototype.clearFX = function (ship) {
            ship.height = ship.originalHeight;
            ship.width = ship.originalWidth;
            _super.prototype.clearFX.call(this, ship);
        };
        return shrinkFx;
    })(effectBase);
    effects.shrinkFx = shrinkFx;    
})(effects || (effects = {}));
