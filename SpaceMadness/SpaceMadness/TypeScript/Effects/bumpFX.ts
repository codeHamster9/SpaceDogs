/// <reference path="effectBase.ts" />

module effects {
    export class bumpFX extends effectBase {
        type: string;
        role: bool;
        borderX: number;
        borderY: number;

        constructor(ship: spaceShip, hitter: bool) {
            super("bump", ship);
            this.borderX = document.getElementById("myCanvas").clientWidth;
            this.borderY = document.getElementById("myCanvas").clientHeight
            this.duration = 8;
            this.role = hitter;
        }

        public apply(ship: spaceShip) {

            if (ship.x < this.borderX) {
                if (this.role) {
                    ship.x = (ship.x + 3.5);
                }
                else ship.x = (ship.x - 3.5);
                ship.isHelmsLocked = true;
            }

            if (this.duration == 0) {
                this.clearFX(ship);
            }
            this.duration--;
        }

        public clearFX(ship: spaceShip) {
            ship.isUnderEffect = false;
            ship.fx = null;
            ship.isHelmsLocked = false;
        }
    }
}