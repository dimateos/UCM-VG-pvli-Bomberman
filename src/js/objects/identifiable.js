'use strict';

var GameObject = require('./gameObject.js');
var Point = require('../point.js');

//default identifiable values
var idBodySize = new Point(48, 48); //little smaller
var idBodyOffset = new Point(0,  0);
var idExtraOffset = new Point(5, 5); //reaquired because id body is not full res

var idSpritePath = 'flame';


function Identifiable(game, position, scale, id) {

    var idPosition = position.add(idExtraOffset.x, idExtraOffset.y);

    GameObject.call(this, game, position, idSpritePath, scale);

    this.id = id;
  }

Identifiable.prototype = Object.create(GameObject.prototype);
Identifiable.prototype.constructor = Identifiable;

Identifiable.prototype.countDown = function() {};

module.exports = Identifiable;
