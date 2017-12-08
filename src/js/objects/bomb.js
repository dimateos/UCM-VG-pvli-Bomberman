'use strict';

var  Bombable = require('./bombable.js'); //father
var Point = require('../point.js');

//default bomb values
var bombBodySize = new Point(48, 48); //little smaller
var bombBodyOffset = new Point(0,  0);
//var bombExtraOffset = new Point(6, -20); //reaquired because bomb body is not full res

var bombImmovable = true;
var bombInvecible = false;

var bombLives = 1;
var bombPower = 1;
var bombTimer = 3000;

var bombSpritePath = 'bomb'; //partial, to complete with numbomb


function Bomb (game, position, scale, bombGroup, player, mods) {

    Bombable.call(this, game, position, bombSpritePath,
        scale, bombBodySize, bombBodyOffset, bombImmovable, bombLives, bombInvecible);

    this.timer = bombTimer;
    this.power = bombPower;

    this.bombGroup = bombGroup;
    this.player = player;

    this.mods = mods;

    game.time.events.add(this.timer, this.xplode, this);
};

Bomb.prototype = Object.create(Bombable.prototype);
Bomb.prototype.constructor = Bomb;

Bomb.prototype.xplode = function() {
    this.bombGroup.remove(this, true); //removes and destroys
    //this.destroy();

    this.player.bombs++; //adds a bomb back to the player
}
module.exports = Bomb;
