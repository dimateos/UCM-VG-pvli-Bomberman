'use strict';

function Point(x, y) {

    Phaser.Point.call(this, x, y);

    this.x = x;
    this.y = y;
}
Point.prototype = Object.create(Phaser.Point.prototype);
Point.prototype.constructor = Point;

module.exports = Point;
