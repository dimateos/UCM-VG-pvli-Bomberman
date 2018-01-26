'use strict';
var config = require('../config.js');

var Bombable = require('../objects/bombable.js');
var Point = require('../general/point.js');
var Enemy = require('../enemy/enemy.js'); //to spawn them

const defaultEnemyType = config.defaultEnemyType;

//Portal objects' data
const portalImmovable = config.portalImmovable;
const portalInvencible = config.portalInvencible;

const portalSprite = config.keys.portal;
const portalDropId = config.portalDropId; //always
const portalSpinVel = config.portalSpinVel;

const portalBombTimer = config.portalBombTimer; //to sync with flames
const portalSpawnTimer = config.portalSpawnTimer; //cooldown to spawn enemies

const portalAnchor = config.portalAnchor;

var portalSound;

//Portal constructor. Inherits from Bombable
function Portal(game, level, groups, position, sprite, tileData, bodyOffSet, immovable, lives, invencibleTime) {

    this.tileData = tileData;
    this.level = level;

    Bombable.call(this, game, level, groups, position, sprite,
        this.tileData.Scale, this.tileData.Res, bodyOffSet, immovable,
        lives, invencibleTime, portalDropId)

    this.animations.add("darken");

    this.spawned = false;
    this.loadNext = false;

    this.portalSound = game.add.audio('portal');
}

Portal.prototype = Object.create(Bombable.prototype);
Portal.prototype.constructor = Portal;


Portal.prototype.update = function () {
    this.checkFlames(); //player and bomb rewrite (extend) update

    if (this.spawned) {
        this.rotation += portalSpinVel;

        if (this.groups.enemy.children.length === 0) {
            this.game.physics.arcade.overlap(this, this.groups.player, nextLevel);
            if (this.loadNext) this.level.generateNextMap();
        }
    }

    function nextLevel(portal, player) {
        portal.loadNext = true;
        portal.portalSound.stop();
    }
}

//player, bomb, enemie, etc will extend this
Portal.prototype.die = function () {

    if (this.spawned) this.game.time.events.add(portalBombTimer + 5, this.spawnEnemie, this);

    else {
        this.lives--;

        if (this.lives <= 0) //spawn the portal
        {
            this.animations.play("darken", 15);
            this.game.time.events.add(portalBombTimer + 5, this.spawnPortal, this);
        }
    }
    this.game.time.events.add(portalSpawnTimer, flipInven, this);

    function flipInven() { this.tmpInven = false; }
}

//switches the box into the portal
Portal.prototype.spawnPortal = function () {

    this.spawned = true; //bool for the state
    this.groups.portal.add(this); //changes its group
    this.level.updateSquare(this.position, this.level.types.free.value); //update map

    this.body.width /= 2; //changes its body (smaller)
    this.body.height /= 2;
    this.body.offset = new Point(
        this.body.width * this.tileData.Scale.y,
        this.body.height * this.tileData.Scale.x);

    this.position = new Point( //moves and anchors to rotate
        this.body.position.x + this.body.width,
        this.body.position.y + this.body.height);
    this.anchor.setTo(portalAnchor.x, portalAnchor.y);

    this.portalSound.loopFull(0.3);

    this.loadTexture(portalSprite); //change sprite
}

//spawns an enemie
Portal.prototype.spawnEnemie = function () {

    var enemyPos = new Point(
        this.position.x - this.body.width, //corrects the anchor
        this.position.y - this.body.height);

    this.groups.enemy.add(new Enemy(this.game, enemyPos,
        this.level, defaultEnemyType, this.tileData, this.groups, portalDropId));
}


module.exports = Portal;
