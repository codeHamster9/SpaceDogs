/// <reference path="../spaceShip.ts" />

module effects {

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
            //override thisss
        }

        public clearFX(ship: spaceShip): void {

            ship.isUnderEffect = false;
            ship.fx = null;
            document.getElementById('myCanvas').textContent = "";
        }
    }
}