'use strict';

//Extends Phaser.Point
function Point(x, y) {

    Phaser.Point.call(this, x, y);
}
Point.prototype = Object.create(Phaser.Point.prototype);
Point.prototype.constructor = Point;

//calculates real position of a map point based on tileData
Point.prototype.applyTileData = function (tileData, extraOffset) {

    this.multiply(tileData.Res.x,tileData.Res.y)
    .multiply(tileData.Scale.x,tileData.Scale.y)
    .add(tileData.Offset.x, tileData.Offset.y);


    if (extraOffset !== undefined)
        return this.add(extraOffset.x, extraOffset.y);
    else return this;
}
//gets the calculated real position of a map point based on tileData
Point.prototype.getAppliedTileData = function (tileData, extraOffset) {

    var tmp = new Point(this.x, this.y)
        .multiply(tileData.Res.x,tileData.Res.y)
        .multiply(tileData.Scale.x,tileData.Scale.y)
        .add(tileData.Offset.x, tileData.Offset.y);

    if (extraOffset !== undefined)
        return tmp.add(extraOffset.x, extraOffset.y);
    else return tmp;
}

//calculates map position of a real point based on tileData
//** not the exact square **
Point.prototype.reverseTileData = function (tileData, extraOffset) {

    if (extraOffset !== undefined)
        this.subtract(extraOffset.x, extraOffset.y);

    this.subtract(tileData.Offset.x, tileData.Offset.y)
        .divide(tileData.Scale.x,tileData.Scale.y)
        .divide(tileData.Res.x,tileData.Res.y);

    return this;
}
//gets the calculated map position of a real point based on tileData
Point.prototype.getReversedTileData = function (tileData, extraOffset) {

    var tmp = new Point(this.x, this.y);
    //console.log(tmp);

    if (extraOffset !== undefined)
        tmp.subtract(extraOffset.x, extraOffset.y);

    tmp.subtract(tileData.Offset.x, tileData.Offset.y)
        .divide(tileData.Scale.x, tileData.Scale.y)
        .divide(tileData.Res.x, tileData.Res.y);

    return tmp;
}

//gets rounded map square value
Point.prototype.getMapSquareValue = function (tileData, extraOffset) {

    var exactMapValue = this.getReversedTileData(tileData, extraOffset);
    //console.log(exactMapValue);

    var difX = exactMapValue.x % 1;
    exactMapValue.x -= difX;
    if (difX >= 0.5) exactMapValue.x++;

    var difY = exactMapValue.y % 1;
    exactMapValue.y -= difY;
    if (difY >= 0.5) exactMapValue.y++;

    //console.log(exactMapValue);
    return exactMapValue;
}

module.exports = Point;
