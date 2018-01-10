'use strict';

var Bombable = require('../objects/bombable.js');
var Point = require('../point.js');
var Enemy = require('../objects/enemy.js'); //to spawn them
var defaultEnemyType = 0;

// sprite: 'portal', pts: 0,
// mods: [modsFunctions.levelUp]

// levelUp: function () {
//     console.log("Next level!");
// },

//default portal values
//var portalBodySize = new Point(48, 48); //little smaller
//var portalBodyOffset = new Point(0, 0);

var portalImmovable = true;
var portalInvencible = true;
var portalLives = 666; //irrelevant atm

var portalSprite = "portal";
var portalDropId = undefined; //always

var portalBombTimer = 500; //to sync with flames
var portalSpawnTimer = 1500; //to sync with flames

function Portal (game, level, groups, position, sprite, tileData, bodyOffSet, immovable, lives, invencibleTime) {

    //var portalPosition = position.add(portalExtraOffset.x, portalExtraOffset.y);

    //var portalBodySize = new Point(bodySize.x/2, bodySize.y/2); //so you get to the center
    //var bodyOffSet = portalBodySize; //the half too
    this.level = level;
    this.tileData = tileData;

    Bombable.call(this, game, groups, position, sprite,
        this.tileData.Scale, this.tileData.Res, bodyOffSet, immovable,
        lives, invencibleTime, portalDropId)

    this.spawned = false;
}

Portal.prototype = Object.create(Bombable.prototype);
Portal.prototype.constructor = Portal;


Portal.prototype.update = function() {
    this.checkFlames(); //player and bomb rewrite (extend) update

    if (this.spawned && this.groups.enemy.children.length === 0)
        this.game.physics.arcade.overlap(this, this.groups.player, this.nextLevel, null, this);
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
    console.log(this.groups.portal.children);

    this.loadTexture(portalSprite); //change sprite
}

//spawns an enemie
Portal.prototype.spawnEnemie = function () {
    console.log(this.groups.enemy.children);

    var enemyPos = new Point(this.position.x, this.position.y);

    this.groups.enemy.add(new Enemy (this.game, enemyPos,
        this.level, defaultEnemyType, this.tileData, this.groups, portalDropId));
}

Portal.prototype.nextLevel = function () {
    console.log("too the nexttttt");
}

module.exports = Portal;
