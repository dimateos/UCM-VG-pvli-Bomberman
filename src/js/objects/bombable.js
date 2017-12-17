'use strict';

var Physical = require('./physical.js'); //father
//some drop powerUps
var Identifiable = require('../id/identifiable.js');

//default bombable values
var bombableTimer = 500; //to sync with flames

//var Id = Identifiable.Id; //the mini factory is in Identifiable
//var bombableDropId = new Id (1,1);


function Bombable(game, groups, position, sprite, scale, bodySize, bodyOffSet, immovable, lives, invencible, dropId) {

    Physical.call(this, game, position, sprite, scale, bodySize, bodyOffSet, immovable);

    this.groups = groups;
    this.tmpInven = false; //flip flop

    //not really needed atm, but allows special blocks
    //this could be handled in the player
    this.lives = lives;
    this.invencible = invencible;
    this.dead = false;

    this.dropId = dropId;
}

Bombable.prototype = Object.create(Physical.prototype);
Bombable.prototype.constructor = Bombable;


Bombable.prototype.update = function() {
    this.checkFlames(); //player and bomb rewrite (extend) update
}

//common for all bombables
Bombable.prototype.checkFlames = function() {

    //console.log(this.flamesGroup);
    if (!this.dead) //maybe a invencible player puts a bomb on just a bomb
    this.game.physics.arcade.overlap(this, this.groups.flame, onFire, checkVulnerability, this);

    function checkVulnerability () {
        //console.log("checkin vulv");
        return (!this.invencible && !this.tmpInven);
    }

    function onFire () {
        //console.log("on fire");
        this.tmpInven = true;

        //die should be insta and then in die handle sync
        //so the player can die insta etc (block mov)
        //this.game.time.events.aadd(bombableTimer, this.die, this);
        this.die();
    }
}

//player, bomb, enemie, etc will extend this
Bombable.prototype.die = function () {
    //console.log("checkin die");
    this.lives--;

    if (this.lives <= 0) {
        this.dead = true;
        this.visible = false;

        //if it has a power up, drops it
        if (this.dropId !== undefined)
            this.game.time.events.add(bombableTimer-5, drop, this);

        //the destroy the bombable
        this.game.time.events.add(bombableTimer+5, this.destroy, this);
    }
    else this.game.time.events.add(bombableTimer, flipInven, this);


    function flipInven () { this.tmpInven = false; }
    function drop() {
        this.groups.powerUp.add(
            new Identifiable(this.game, this.position, this.scale, this.dropId));
    }
}


module.exports = Bombable;
