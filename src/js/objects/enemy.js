'use strict';

var Bombable = require('./bombable.js'); //father
var Point = require('../point.js');


//default enemy values
var enemySpritePath = 'enemy';

var enemyBodySize = new Point(64, 64);
var enemyBodyOffset = new Point(0, 0);
var enemyExtraOffset = new Point(0, 0); //to center it

var enemyImmovable = false;
var enemyInvecible = false;

var enemyLives = 1;
var enemyVelocity = 200;


function Enemy (game, position, level, enemyType, tileData, groups, dropId) {

    this.level = level;
    this.groups = groups;
    this.tileData = tileData;
    this.enemyType = enemyType;

    var enemyPosition = position.add(enemyExtraOffset.x, enemyExtraOffset.y);

    Bombable.call(this, game, groups, enemyPosition, enemySpritePath,
        tileData.Scale, enemyBodySize, enemyBodyOffset,
        enemyImmovable, enemyLives, enemyInvecible, dropId);


    this.velocity = enemyVelocity;
};

Enemy.prototype = Object.create(Bombable.prototype);
Enemy.prototype.constructor = Enemy;


Enemy.prototype.hey = function() {console.log(this);};

Enemy.prototype.update = function() {

    this.checkFlames(); //bombable method

    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
}

module.exports = Enemy;
