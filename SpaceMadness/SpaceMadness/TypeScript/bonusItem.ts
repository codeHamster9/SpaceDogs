/// <reference path="ICollidable.ts" />


class bonusItem implements ICollidable {
    x: number;
    y: number;
    type: string;
    width: number;
    height: number;
    value: number;
    timeout: number;
    name: number;
    distance: number;
  

    constructor(item: bonusItem) {
        this.x = item.x;
        this.y = item.y;
        this.type = "item";
        this.value = item.value;
        this.timeout = item.timeout;
        this.name = item.name;
        this.width = 37;
        this.height = 37;
    }
}