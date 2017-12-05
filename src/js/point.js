'use strict';

//Extends Phaser.Point
function Point(x, y) {

    Phaser.Point.call(this, x, y);
}
Point.prototype = Object.create(Phaser.Point.prototype);
Point.prototype.constructor = Point;

//calculates real position of a map point based on tileData
Point.prototype.applyTileData = function (tileData) {

    return this
        .multiply(tileData.Res.x,tileData.Res.y)
        .multiply(tileData.Scale.x,tileData.Scale.y)
        .add(tileData.Offset.x, tileData.Offset.y);
}

module.exports = Point;
