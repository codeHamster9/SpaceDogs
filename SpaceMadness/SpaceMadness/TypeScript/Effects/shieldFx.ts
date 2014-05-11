/// <reference path="effectBase.ts" />

module effects {
    export class shieldFx extends effectBase {

        constructor(ship: spaceShip) {
            super("shield", ship);
        }

        public apply(ship: spaceShip) {
            ship.shieldsUp = true;
            if (this.duration == 0)
                this.clearFX(ship);
            this.duration--;
        }

        private clearFX(ship: spaceShip) {
            ship.shieldsUp = false;
            super.clearFX(ship);
        }
    }
}