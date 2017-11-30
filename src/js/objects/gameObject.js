'use strict';

function Point(x, y) {
    this.x = x;
    this.y = y;
  }

//Deberia heredar de sprite
function gameObject (graphic, position) { //GO contructor
  this._graphic = graphic;
  this._position = position;
}
gameObject.prototype.draw = function () {}; //the only common function

module.exports = gameObject;
