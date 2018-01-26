'use strict';
const config = require('../config.js');

const Physical = require('./physical.js'); //father
//some drop powerUps
const Identifiable = require('../id/identifiable.js');

//default bombable values
const bombableTimer = config.bombableTimer; //to sync with flames

const alphaWavingSpeed = config.alphaWavingSpeed;
const playerInitialAlphaAngle = config.playerInitialAlphaAngle; //sin(playerInitialAlphaAnlge) -> alpha
const step = config.step; //degrees

//Inherits from Physical
//Makes objects vulneable (interacts with flames)
function Bombable(game, level, groups, position, sprite, scale, bodySize, bodyOffSet, immovable, lives, invencibleTime, dropId) {

    Physical.call(this, game, position, sprite, scale, bodySize, bodyOffSet, immovable);

    this.animations.add("darken"); //simple animation

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

    this.dropId = dropId; //drops powerups
    this.counterAngle = playerInitialAlphaAngle * step; //used for the invencible alpha waving
}

Bombable.prototype = Object.create(Physical.prototype);
Bombable.prototype.constructor = Bombable;

//children bombables will extend this
Bombable.prototype.update = function () {
    this.checkFlames(); //player and bomb rewrite (extend) update
}

//Checls overlap with flames, and if vulneable and not dead then calls die()
Bombable.prototype.checkFlames = function () {

    if (!this.dead) //maybe a invencible player puts a bomb on just a bomb
        this.game.physics.arcade.overlap(this, this.groups.flame, onFire, checkVulnerability, this);

    function checkVulnerability() {
        return (!this.invencible && !this.tmpInven);
    }

    function onFire(bombable, flame) {
        this.tmpInven = true;

        //die should be insta and then in die handle sync
        //so the player can die insta etc (block mov)
        this.die(flame);
    }
}

//changes alpha to simulate being invulnerable
Bombable.prototype.invencibleAlpha = function () {

    var tStep = Math.sin(this.counterAngle);

    this.counterAngle += step * alphaWavingSpeed;

    //only positive sin (no negative alpha)
    if (this.counterAngle >= (180 - playerInitialAlphaAngle) * step) {
        this.counterAngle = playerInitialAlphaAngle * step;
    }

    this.alpha = tStep;
}

//player, bomb, enemie, etc will extend this
//in this case reduces lives and if 0, destroys and drops de powerUps
Bombable.prototype.die = function () {
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
