/// <reference path="TypeScript/spaceShip.ts" />

module effects{

    export class effectBase {
        duration: number;
        Type: string;
        ship: spaceShip;

        constructor(public type: string, ship: spaceShip) {
            this.Type = type;
            this.duration = 420;
            this.ship = ship;
        }

        public apply(ship: spaceShip): void {
            //override this
        };

        public clearFX(ship: spaceShip): void {

            ship.isUnderEffect = false;
            ship.fx = null;
            document.getElementById('myCanvas').textContent = "";
        };
    }
        
    export class drunkFx extends effectBase {

        amount: number;
        borderX: number;
        borderY: number;
        inverted: bool;

        constructor(ship: spaceShip, alcoholLvl: number) {
            super("drunk", ship);
            this.amount = alcoholLvl;
            this.borderX = document.getElementById("myCanvas").clientWidth;
            this.borderY = document.getElementById("myCanvas").clientHeight
            this.inverted = false;
        }
        public apply(ship: spaceShip) {

            if (this.duration % 3 == 0) {
                var drunkX = Math.round(Math.random() * this.amount);
                var drunkY = Math.round(Math.random() * this.amount);
                //TODO: check for screen Boundries;
                if (!this.inverted) {
                    ship.x = ship.x + drunkX;
                    ship.y = ship.y + drunkY;
                    this.inverted = true;
                }
                else {
                    ship.x = ship.x - drunkX;
                    ship.y = ship.y - drunkY;
                    this.inverted = false;
                };
            }

            if (this.duration == 0) {
                this.clearFX(ship);
            }
            this.duration--;
        }
    }

    export class bumpFX extends effectBase {
        type: string;
        role: bool;
        borderX: number;
        borderY: number;

        public apply(ship: spaceShip) {

            if (ship.x < this.borderX) {
                if (this.role) {
                    ship.x = (ship.x + 3.5);
                }
                else ship.x = (ship.x - 3.5);
                // isHelmsLocked = true;
            }
            if (this.duration == 0) {
                this.clearFX(ship);
            }
            this.duration--;
        }

        public clearFX(ship: spaceShip) {
            ship.isUnderEffect = false;
            ship.fx = null;
            // isHelmsLocked = false;
        }

        constructor(ship: spaceShip, hitter: bool) {
            super("bump", ship);
            this.borderX = document.getElementById("myCanvas").clientWidth;
            this.borderY = document.getElementById("myCanvas").clientHeight
            this.duration = 8;
            this.role = hitter;
        }
    }

    export class shieldFx extends effectBase {

        constructor(ship) {
            super("shield", ship);
        }
        public apply(ship: spaceShip) {
            ship.shieldsUp = true;
            if (this.duration == 0) {
                this.shieldDown(ship);
                this.clearFX(ship);
            }
            this.duration--;
        }

        public shieldDown(ship: spaceShip) {
            ship.shieldsUp = false;
        }
    }

    export class shrinkFx extends effectBase {

        resizeLimit: number;

        constructor(ship: spaceShip) {
            super("shrink", ship);
            this.resizeLimit = 32;
        }

        public apply(ship: spaceShip) {
            if (this.duration > 30)
                this.shrink(ship);
            else this.grow(ship);
            this.duration--;
            if (this.duration == 0) {
                this.clearFX(ship);
            }
        }

        private shrink(ship: spaceShip) {
            if (ship.width >= this.resizeLimit) {
                ship.width--;
                ship.height--;
            }
        }

        private grow(ship: spaceShip) {
            if (ship.width < ship.originalWidth) {
                ship.width++;
                ship.height++;
            }
        }

        public clearFX(ship: spaceShip): void {
            ship.height = ship.originalHeight;
            ship.width = ship.originalWidth;
            super.clearFX(ship);
        };
    }
}