'use strict';

var Physical = require('../objects/physical.js');
var Point = require('../point.js');

var idData = require('./idData.js'); //all the database

//default identifiable values
var idBodySize = new Point(48, 48); //little smaller
var idBodyOffset = new Point(0, 0);
var idExtraOffset = new Point(5, 5); //reaquired because id body is not full res
var idImmovable = true;

function Identifiable(game, position, scale, id) {

    var idPosition = position.add(idExtraOffset.x, idExtraOffset.y);

    Physical.call(this, game, position, idData[id.tier][id.num].sprite,
      scale, idBodySize, idBodyOffset, idImmovable);

    this.id = id;;
  }

Identifiable.prototype = Object.create(Physical.prototype);
Identifiable.prototype.constructor = Identifiable;


Identifiable.prototype.update = function() {

}

module.exports = Identifiable;
