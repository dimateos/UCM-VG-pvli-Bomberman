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
Point.prototype.getMapSquarePos = function (tileData, extraOffset) {

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

//gets the relative normalized dir of the extra square the player is touching
//compares the real position and the calculated by getMapSquarePos
//there is some margin to detect being centered
Point.prototype.getMapSquareExtraPos = function (tileData, extraOffset) {

    var exactMapValue = this.getReversedTileData(tileData, extraOffset);
    var virtualMapValue = this.getMapSquarePos(tileData, extraOffset);
    var extraDir = new Point();
    // console.log(exactMapValue);
    // console.log(virtualMapValue);

    //margin to consider the center wider (not just a point)
    var margin = (tileData.Res.x*tileData.Scale.x+tileData.Res.y*tileData.Scale.y)/2;
    margin *= 0.001
    //console.log(margin);

    var difX = exactMapValue.x - virtualMapValue.x;
    //console.log(difX);
    if (difX < 0-margin) extraDir.x = -1;
    else if (difX > 0+margin) extraDir.x = 1;

    var difY = exactMapValue.y - virtualMapValue.y;
    if (difY < 0-margin) extraDir.y = -1;
    else if (difY > 0+margin) extraDir.y = 1;

    //console.log(extraDir);
    return extraDir;
}

//returns true if the directions are parallel (only normalized dirs)
Point.prototype.isParallel = function (dir) {

    return (this.x === dir.x && this.y === dir.y)
        || (this.x === -dir.x && this.y === -dir.y);
}

module.exports = Point;
