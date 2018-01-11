'use strict';

var Bombable = require('./bombable.js'); //father
var Point = require('../point.js');


//default enemy values
var enemySpritePath = 'enemy';

var enemyBodySize = new Point(64, 64); //TODO: should be smaller
var enemyBodyOffset = new Point(0, 0);
var enemyExtraOffset = new Point(0, 0); //to center it

var enemyImmovable = false;
var enemyInvecibleTime = 2500;

var enemyLives = 1;
var enemyVelocity = 90;


function Enemy (game, position, level, enemyType, tileData, groups, dropId) {

    this.groups = groups;
    this.tileData = tileData;
    this.level = level;

    this.enemyType = enemyType;
    var enemyPosition = position.add(enemyExtraOffset.x, enemyExtraOffset.y);

    Bombable.call(this, game, level, groups, enemyPosition, enemySpritePath,
        tileData.Scale, enemyBodySize, enemyBodyOffset,
        enemyImmovable, enemyLives, enemyInvecibleTime, dropId);

    this.body.bounce.setTo(1,1);
    this.body.velocity.x = enemyVelocity;

    level.updateSquare(position, level.types.free.value);
};

Enemy.prototype = Object.create(Bombable.prototype);
Enemy.prototype.constructor = Enemy;


Enemy.prototype.hey = function() {console.log(this);};

Enemy.prototype.update = function() {

    this.checkFlames(); //bombable method

    if (this.dead) {
        this.body.immovable = true;
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }
    else {
        this.game.physics.arcade.collide(this, this.groups.wall, logic, null, this);
        this.game.physics.arcade.collide(this, this.groups.box, logic, null, this);
        this.game.physics.arcade.collide(this, this.groups.bomb, logic, null, this);
        //not sure in the original
        this.game.physics.arcade.collide(this, this.groups.enemy, logic, null, this);
    }

    //atm no logic nopie
    function logic () {
        //console.log("bounce")
        //this.body.velocity.x=-this.body.velocity.x;
    }

}

module.exports = Enemy;
