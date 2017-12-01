'use strict';

var Physical = require('./physical.js');

function Bombable(game, position, sprite, scale, bodySize, bodyOffSet, immovable, lives, invencible) {

    Physical.call(this, game, position, sprite, scale, bodySize, bodyOffSet, immovable);

    this.lives = lives;
    this.invencible = invencible;

}

Bombable.prototype = Object.create(Physical.prototype);
Bombable.prototype.constructor = Bombable;

module.exports = Bombable;
