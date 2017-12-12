'use strict';

var Physical = require('../objects/physical.js');
var Point = require('../point.js');

var idData = require('./idData.js'); //all the database

//default identifiable values
var idBodySize = new Point(48, 48); //little smaller
var idBodyOffset = new Point(0,  0);
var idExtraOffset = new Point(5, 5); //reaquired because id body is not full res
var idImmovable = true;

function Identifiable(game, position, scale, id) {

    var idPosition = position.add(idExtraOffset.x, idExtraOffset.y);

    Physical.call(this, game, position, idData[id][id].sprite, scale, idBodySize, idBodyOffset, idImmovable);

    this.id = id;
  }

Identifiable.prototype = Object.create(Physical.prototype);
Identifiable.prototype.constructor = Identifiable;


Identifiable.prototype.update = function() {
  //for (var numPlayer = 0; numPlayer < players.length; numPlayer++) {
    //this.game.physics.arcade.collide(players[numPlayer], groups.wall);
}

//used only by identifiables
function checkOverlap(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);
}

module.exports = Identifiable;
