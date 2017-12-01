'use strict';

var  Bombable = require('./bombable.js');

function Bomb (game, position, sprite, scale, bodySize, bodyOffSet, immovable, lives, invencible, timer, power, bombGroup) {

    Bombable.call(this, game, position, sprite, scale, bodySize, bodyOffSet, immovable, lives, invencible);

    game.time.events.add(timer, this.xplode, this);

    this.timer = timer;
    this.power = power;

    this.bombGroup = bombGroup;

};

Bomb.prototype = Object.create(Bombable.prototype);
Bomb.prototype.constructor = Bomb;

Bomb.prototype.xplode = function() {
    this.bombGroup.remove(this, true); //removes and destroy
    //this.destroy();
}

module.exports = Bomb;
