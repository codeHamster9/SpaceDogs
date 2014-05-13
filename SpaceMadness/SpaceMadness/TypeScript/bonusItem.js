/// <reference path="ICollidable.ts" />
var bonusItem = (function () {
    function bonusItem(item) {
        this.x = item.x;
        this.y = item.y;
        this.type = "item";
        this.value = item.value;
        this.timeout = item.timeout;
        this.name = item.name;
        this.width = 37;
        this.height = 37;
    }
    return bonusItem;
})();
//# sourceMappingURL=bonusItem.js.map
