'use strict';

var Physical = require('../objects/physical.js');
var Point = require('../point.js');

var idDataBase = require('./idDataBase.js'); //all the database

//default identifiable values
var idBodySize = new Point(48, 48); //little smaller
var idBodyOffset = new Point(0, 0);
var idExtraOffset = new Point(5, 5); //reaquired because id body is not full res
var idImmovable = true;


function Identifiable(game, position, scale, id) {

    var idPosition = position.add(idExtraOffset.x, idExtraOffset.y);

    Physical.call(this, game, position, idDataBase[id.tier][id.num].sprite,
      scale, idBodySize, idBodyOffset, idImmovable);

    this.id = id;;
  }

Identifiable.prototype = Object.create(Physical.prototype);
Identifiable.prototype.constructor = Identifiable;


Identifiable.addPowerUps = function(powerUpIds, target, reverseMode) {
  //Adds the id of the mods to the player.mods (so we can reverse them, etc)
  for (var i = 0; i < powerUpIds.length; i++) {
      target.mods.push(powerUpIds[i]);

      var mods = idDataBase[powerUpIds[i].tier][powerUpIds[i].num].mods;
      this.applyMods(mods, target, reverseMode);
  }
}

Identifiable.applyMods = function(mods, target, reverseMode) {
  for (var i = 0; i < mods.length; i++) {
      //console.log(target[mods[i].key]);
      //console.log(mods[i].key, mods[i].mod);

      switch (mods[i].type) {
        case "number":
          target[mods[i].key] += mods[i].mod;
          break;
        case "bool":
          target[mods[i].key] = mods[i].mod;
          break;
        case "function":
          target[mods[i].key]();
          break;
        case "bomb":
          target.bombMods.push(mods[i].mod);
          break;
      }
  }
  //console.log(target.mods);
}


Identifiable.prototype.update = function() {

}

module.exports = Identifiable;
