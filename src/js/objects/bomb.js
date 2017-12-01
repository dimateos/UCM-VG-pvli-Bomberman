'use strict';

var  Bombable = require('./bombable.js');

function Bomb (game, position, sprite, scale, bodySize, bodyOffSet, immovable, lives, invencible, timer, power) {

    Bombable.call(this, game, position, sprite, scale, bodySize, bodyOffSet, immovable, lives, invencible);

    this.timer = timer;
    this.power = power;

};

Bomb.prototype = Object.create(Bombable.prototype);
Bomb.prototype.constructor = Bomb;

Bomb.prototype.update = function() {

}

module.exports = Bomb;
