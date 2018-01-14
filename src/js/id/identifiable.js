'use strict';

var Physical = require('../objects/physical.js');
var Point = require('../general/point.js');

var idDataBase = require('./idDataBase.js'); //all the database

//default identifiable values
var idBodySize = new Point(32, 32); //little smaller
var idBodyOffset = new Point(0, 0);
var idExtraOffset = new Point(14, 10); //id body is not full res
var idImmovable = true;


function Identifiable(game, position, scale, id) {

    var idPosition = new Point (position.x, position.y).add(idExtraOffset.x, idExtraOffset.y);

    Physical.call(this, game, idPosition, idDataBase[id.tier][id.num].sprite,
      scale, idBodySize, idBodyOffset, idImmovable);

    this.id = id;
    this.pts = idDataBase[id.tier][id.num].pts;
}

Identifiable.prototype = Object.create(Physical.prototype);
Identifiable.prototype.constructor = Identifiable;


//method used by players to pick powerUps (so they do not need idDataBase)
Identifiable.pickPowerUp = function(powerUp, player) {
    var mods = idDataBase[powerUp.id.tier][powerUp.id.num].mods;
    Identifiable.applyMods(mods, player);
}


//generic base id factorie
Identifiable.Id = function (tier, num) {this.tier = tier; this.num = num;}
//get tier size (for the map rnd generation)
Identifiable.tierSize = function (tier) {return idDataBase[tier].length}


Identifiable.addPowerUps = function(powerUpIds, target, reverseMode) {
  //Adds the id of the mods to the player.mods (so we can reverse them, etc)
  for (var i = 0; i < powerUpIds.length; i++) {
      if (!reverseMode)target.mods.push(powerUpIds[i]);
      //else target.mods.pop(); //ordered. NOT SURE if we should keep them
      //we do not pop, we keep target.mods as a log of powerUps

      var mods = idDataBase[powerUpIds[i].tier][powerUpIds[i].num].mods;
      Identifiable.applyMods(mods, target, reverseMode);
  }
}

//call respectives functions applied to the player
Identifiable.applyMods = function(mods, target, reverseMode) {
  for (var i = 0; i < mods.length; i++) {
      //console.log(target[mods[i].key]);
      //console.log(mods[i].key, mods[i].mod);
      mods[i].call(target, reverseMode);
  }
  //console.log(target.mods);
}

module.exports = Identifiable;
