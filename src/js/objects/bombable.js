'use strict';

var Physical = require('./physical.js'); //father
//some drop powerUps
var Identifiable = require('../id/identifiable.js');

//default bombable values
var bombableTimer = 500;

var Mod = Identifiable.Mod; //the mini factory is in Identifiable
//var bombableDropId = new Mod (1,1);


function Bombable(game, groups, position, sprite, scale, bodySize, bodyOffSet, immovable, lives, invencible, dropId) {

    Physical.call(this, game, position, sprite, scale, bodySize, bodyOffSet, immovable);

    this.flamesGroup = groups.flame;
    this.tmpInven = false; //flip flop

    //not really needed atm, but allows special blocks
    //this could be handled in the player
    this.lives = lives;
    this.invencible = invencible;

    this.dropId = dropId;

    this.dieTimer = bombableTimer;
}

Bombable.prototype = Object.create(Physical.prototype);
Bombable.prototype.constructor = Bombable;

Bombable.prototype.hey = function () {console.log("hey");};

Bombable.prototype.update = function() {
    this.checkFlames(); //player rewrites (extends) update
}

//common for all bombables
Bombable.prototype.checkFlames = function() {

    //console.log(this.flamesGroup);

    this.game.physics.arcade.overlap(this, this.flamesGroup, onFire, checkVulnerability, this);

    function checkVulnerability () {
        //console.log("checkin vulv");
        return (!this.invencible && !this.tmpInven);
    }

    function onFire () {
        //console.log("on fire");
        this.tmpInven = true;
        this.game.time.events.add(this.dieTimer, this.die, this);
    }
}

//player, bomb, enemie, etc will extend this
Bombable.prototype.die = function () {
    //console.log("checkin die");

    if (this.dropId !== undefined) var drop = //not really needed atm
        new Identifiable(this.game, this.position, this.scale, this.dropId);

    this.lives--;
    if (this.lives === 0) this.destroy();

    this.tmpInven = false; //vulneable again
}

module.exports = Bombable;
