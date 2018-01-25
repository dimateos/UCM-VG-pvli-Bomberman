'use strict';
const config = require('../config.js');

var Physical = require('./physical.js'); //father
//some drop powerUps
var Identifiable = require('../id/identifiable.js');

//default bombable values
var bombableTimer = 500; //to sync with flames

//var Id = Identifiable.Id; //the mini factory is in Identifiable
//var bombableDropId = new Id (1,1);

const alphaWavingSpeed = config.alphaWavingSpeed;
const playerInitialAlphaAngle = config.playerInitialAlphaAngle; //sin(playerInitialAlphaAnlge) -> alpha
const step = config.step; //degrees

function Bombable(game, level, groups, position, sprite, scale, bodySize, bodyOffSet, immovable, lives, invencibleTime, dropId) {

    Physical.call(this, game, position, sprite, scale, bodySize, bodyOffSet, immovable);

    this.animations.add("darken");

    this.groups = groups;
    this.level = level;

    //allows special blocks, enemies, etc
    this.lives = lives;
    this.tmpInven = false; //flip flop
    this.dead = false;

    //Initial invencible time or not
    this.endInvencibilityCallback = undefined;
    if (invencibleTime === 0) this.invencible = false;
    else if (invencibleTime === -1) this.invencible = true; //invencible 4ever
    else {
        this.invencible = true;
        this.endInvencibilityCallback = this.game.time.events.add(invencibleTime, this.endInvencibility, this);
    }

    this.dropId = dropId;
    this.counterAngle = playerInitialAlphaAngle * step;
}

Bombable.prototype = Object.create(Physical.prototype);
Bombable.prototype.constructor = Bombable;


Bombable.prototype.update = function () {
    this.checkFlames(); //player and bomb rewrite (extend) update
}

//common for all bombables
Bombable.prototype.checkFlames = function () {

    //console.log(this.flamesGroup);
    if (!this.dead) //maybe a invencible player puts a bomb on just a bomb
        this.game.physics.arcade.overlap(this, this.groups.flame, onFire, checkVulnerability, this);

    function checkVulnerability() {
        // console.log("checkin vulv");
        return (!this.invencible && !this.tmpInven);
    }

    function onFire(bombable, flame) {
        // console.log("on fire");
        this.tmpInven = true;

        //die should be insta and then in die handle sync
        //so the player can die insta etc (block mov)
        //this.game.time.events.add(bombableTimer, this.die, this);
        this.die(flame);
    }
}

//changes alpha to simulate being invulnerable
Bombable.prototype.invencibleAlpha = function () {

    var tStep = Math.sin(this.counterAngle);
    // console.log(this.counterAngle/step);

    this.counterAngle += step * alphaWavingSpeed;

    //only positive sin (no negative alpha)
    if (this.counterAngle >= (180 - playerInitialAlphaAngle) * step) {
        this.counterAngle = playerInitialAlphaAngle * step;
    }

    this.alpha = tStep;
}

//player, bomb, enemie, etc will extend this
Bombable.prototype.die = function () {
    // console.log("checkin die");
    this.lives--;

    if (this.lives <= 0) {
        this.dead = true;
        // this.visible = false;

        //if it has a power up, drops it
        if (this.dropId !== undefined)
            this.game.time.events.add(bombableTimer - 5, drop, this);

        //then destroy the bombable
        this.animations.play("darken", 15);
        this.game.time.events.add(bombableTimer + 5, updateAndDestroy, this);
    }
    else this.game.time.events.add(bombableTimer, flipInven, this);


    function flipInven() { this.tmpInven = false; }
    function drop() {

        this.groups.powerUp.add(
            new Identifiable(this.game, this.position, this.scale, this.dropId));
    }
    function updateAndDestroy() {
        // console.log("update and destroy");

        this.level.updateSquare(this.position, this.level.types.free.value)

        this.destroy();
    }
}

//Usesd as callback to remove te temporal inbvulnerability
Bombable.prototype.endInvencibility = function () {
    this.alpha = 1;
    this.invencible = false;
}
//To correctly cancel the callback (if exists)
Bombable.prototype.endlessInvencibility = function () {

    if (this.endInvencibilityCallback !== undefined)

        this.game.time.events.remove(this.endInvencibilityCallback);

    this.invencible = true;
}

module.exports = Bombable;
