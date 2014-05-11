/// <reference path="effectBase.ts" />

module effects {
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