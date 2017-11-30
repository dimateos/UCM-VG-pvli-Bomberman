'use strict';

var  Bombable = require('./bombable.js');

function Player (game, position, sprite, scale, bodySize, bodyOffSet, immovable, lives, invencible, inputs, bombs, mods) {

    Bombable.call(this, game, position, sprite, scale, bodySize, bodyOffSet, immovable, lives, invencible);

    this.bombs = bombs;
    this.mods = mods;
    this.inputs = inputs;

};

Player.prototype = Object.create(Bombable.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {

}

module.exports = Player;
