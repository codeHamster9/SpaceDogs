/// <reference path="effectBase.ts" />

module effects {
    export class drunkFx extends effects.effectBase {

        amount: number;
        borderX: number;
        borderY: number;
        inverted: boolean;

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
}