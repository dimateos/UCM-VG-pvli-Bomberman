'use strict';
const config = require('../config.js');

var Physical = require('../objects/physical.js');
var Point = require('../general/point.js');

//default flameentifiable values
var flameBodySize = config.flameBodySize; //little smaller
var flameBodyOffset = config.flameBodyOffset;
var flameExtraOffset = config.flameExtraOffset; //flame body is not full res
var flameImmovable = config.flameImmovable;
var flameSprite = config.keys.flame;

//Flame constructor. Inherits from Physical
function Flame (game, position, scale, player) {

    this.player = player; //link to reward the kill/points

    var flamePosition = position.add(flameExtraOffset.x, flameExtraOffset.y);

    Physical.call(this, game, position, flameSprite, scale,
        flameBodySize, flameBodyOffset, flameImmovable);

    this.animations.add("flaming", [0, 1, 2, 3, 4], 15, true);
    this.animations.play("flaming");
}

Flame.prototype = Object.create(Physical.prototype);
Flame.prototype.constructor = Flame;

module.exports = Flame;
