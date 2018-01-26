'use strict';

var Physical = require('../objects/physical.js');
var Point = require('../general/point.js');
const config = require('../config.js');

var idDataBase = require('./idDataBase.js'); //all the database

//default identifiable values
const idBodySize = config.idBodySize; //little smaller
const idBodyOffset = config.idBodyOffset;
const idExtraOffset = config.idExtraOffset; //id body is not full res
const idImmovable = config.idImmovable;

var powerUpSound;

//Identifiable constructor. Inherits from Physical. Dropped by enemies/boxes when destroyer.
//Players can pick them and gets their effects applied/points added
function Identifiable(game, position, scale, id) {

    var idPosition = new Point (position.x, position.y).add(idExtraOffset.x, idExtraOffset.y);

    Physical.call(this, game, idPosition, idDataBase[id.tier][id.num].sprite,
      scale, idBodySize, idBodyOffset, idImmovable);

    //sounds when picked
    powerUpSound = this.game.add.audio('powerup');

    this.id = id; //used for consult
    this.pts = idDataBase[id.tier][id.num].pts;
}

Identifiable.prototype = Object.create(Physical.prototype);
Identifiable.prototype.constructor = Identifiable;


//method used by players to pick powerUps (so they do not need idDataBase)
Identifiable.pickPowerUp = function(powerUp, player) {
    var mods = idDataBase[powerUp.id.tier][powerUp.id.num].mods;
    powerUpSound.play();
    Identifiable.applyMods(mods, player);
}


//generic base id factorie
Identifiable.Id = function (tier, num) {this.tier = tier; this.num = num;}
//get tier size (for the map rnd generation)
Identifiable.tierSize = function (tier) {return idDataBase[tier].length;}


//used to add powerUps (requires the ids)
Identifiable.addPowerUps = function(powerUpIds, target, reverseMode) {
  //Adds the id of the mods to the player.mods (so we can reverse them, etc)
  for (var i = 0; i < powerUpIds.length; i++) {
      if (!reverseMode)target.mods.push(powerUpIds[i]);
    // //   //else target.mods.pop(); //ordered. NOT SURE if we should keep them
      //we do not pop, we keep target.mods as a log of powerUps

      var mods = idDataBase[powerUpIds[i].tier][powerUpIds[i].num].mods;
      Identifiable.applyMods(mods, target, reverseMode);
  }
}

//call respectives functions applied to the player
Identifiable.applyMods = function(mods, target, reverseMode) {
  for (var i = 0; i < mods.length; i++) {
      mods[i].call(target, reverseMode);
  }
}

module.exports = Identifiable;
