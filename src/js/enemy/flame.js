'use strict';
const config = require('../config.js');

const Physical = require('../objects/physical.js');
const Point = require('../general/point.js');

//default flame values
const flameBodySize = config.flameBodySize; //little smaller
const flameBodyOffset = config.flameBodyOffset;
const flameExtraOffset = config.flameExtraOffset; //flame body is not full res
const flameImmovable = config.flameImmovable;
const flameSprite = config.keys.flame;

//Flame constructor. Inherits from Physical
//Bombables detect overlap with these and die
function Flame (game, position, scale, player) {

    this.player = player; //link to reward the kill/points

    var flamePosition = position.add(flameExtraOffset.x, flameExtraOffset.y);

    Physical.call(this, game, position, flameSprite, scale,
        flameBodySize, flameBodyOffset, flameImmovable);

    //animation
    this.animations.add("flaming", [0, 1, 2, 3, 4], 15, true);
    this.animations.play("flaming");
}

Flame.prototype = Object.create(Physical.prototype);
Flame.prototype.constructor = Flame;

module.exports = Flame;
