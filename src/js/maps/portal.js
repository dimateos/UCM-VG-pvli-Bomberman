'use strict';

var Bombable = require('../objects/bombable.js');
var Point = require('../general/point.js');
var Enemy = require('../enemy/enemy.js'); //to spawn them
var defaultEnemyType = 0;

var portalImmovable = true;
var portalInvencible = true;

var portalSprite = "portal";
var portalDropId = undefined; //always
var portalSpinVel = 0.05;

var portalBombTimer = 500; //to sync with flames
var portalSpawnTimer = 1500; //cooldown to spawn enemies

function Portal (game, level, groups, position, sprite, tileData, bodyOffSet, immovable, lives, invencibleTime) {

    //var portalPosition = position.add(portalExtraOffset.x, portalExtraOffset.y);

    //var portalBodySize = new Point(bodySize.x/2, bodySize.y/2); //so you get to the center
    //var bodyOffSet = portalBodySize; //the half too
    this.tileData = tileData;

    Bombable.call(this, game, level, groups, position, sprite,
        this.tileData.Scale, this.tileData.Res, bodyOffSet, immovable,
        lives, invencibleTime, portalDropId)

    this.spawned = false;
}

Portal.prototype = Object.create(Bombable.prototype);
Portal.prototype.constructor = Portal;


Portal.prototype.update = function() {
    this.checkFlames(); //player and bomb rewrite (extend) update

    if (this.spawned) {
        this.rotation+= portalSpinVel;

        if (this.groups.enemy.children.length === 0)
            this.game.physics.arcade.overlap(this, this.groups.player, this.nextLevel, null, this);
    }
}

//player, bomb, enemie, etc will extend this
Portal.prototype.die = function () {
    //console.log("checkin die");

    if (this.spawned) this.game.time.events.add(portalBombTimer+5, this.spawnEnemie, this);

    else {
        this.lives--;

        if (this.lives <= 0) //spawn the portal
            this.game.time.events.add(portalBombTimer+5, this.spawnPortal, this);
    }
    this.game.time.events.add(portalSpawnTimer, flipInven, this);

    function flipInven () { this.tmpInven = false; }
}

//switches the box into the portal
Portal.prototype.spawnPortal = function () {

    this.spawned = true; //bool for the state
    this.groups.portal.add(this); //changes its group
    this.level.updateSquare(this.position, this.level.types.free.value); //update map

    this.body.width /= 2; //changes its body (smaller)
    this.body.height /= 2;
    this.body.offset = new Point (
        this.body.width*this.tileData.Scale.y,
        this.body.height*this.tileData.Scale.x);

    this.position = new Point ( //moves and anchors to rotate
        this.body.position.x+this.body.width,
        this.body.position.y+this.body.height);
    this.anchor.setTo(0.5, 0.5);

    this.loadTexture(portalSprite); //change sprite
}

//spawns an enemie
Portal.prototype.spawnEnemie = function () {
    //console.log(this.groups.enemy.children);

    var enemyPos = new Point(
        this.position.x-this.body.width, //corrects the anchor
        this.position.y-this.body.height);

    this.groups.enemy.add(new Enemy (this.game, enemyPos,
        this.level, defaultEnemyType, this.tileData, this.groups, portalDropId));
}

Portal.prototype.nextLevel = function () {
    console.log("too the nexttttt");
}

module.exports = Portal;
