'use strict';

var Physical = require('../objects/physical.js');
var Point = require('../general/point.js');

//default flameentifiable values
var flameBodySize = new Point(48, 48); //little smaller
var flameBodyOffset = new Point(0, 0);
var flameExtraOffset = new Point(5, 5); //flame body is not full res
var flameImmovable = true;
var flameSprite = 'flame';

function Flame (game, position, scale, player) {

    this.player = player; //link to reward the kill/points

    var flamePosition = position.add(flameExtraOffset.x, flameExtraOffset.y);
    
    Physical.call(this, game, position, flameSprite, scale,
        flameBodySize, flameBodyOffset, flameImmovable);
        
    this.animations.add("flaming", [0, 1, 2, 3, 4], 15);
    this.animations.play("flaming");
}

Flame.prototype = Object.create(Physical.prototype);
Flame.prototype.constructor = Flame;

module.exports = Flame;
