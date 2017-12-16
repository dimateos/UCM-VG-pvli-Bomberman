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
var enemyVelocity = 100;


function Enemy (game, position, level, enemyType, tileData, groups, dropId) {

    this.level = level;
    this.groups = groups;
    this.tileData = tileData;
    this.enemyType = enemyType;

    var enemyPosition = position.add(enemyExtraOffset.x, enemyExtraOffset.y);

    Bombable.call(this, game, groups, enemyPosition, enemySpritePath,
        tileData.Scale, enemyBodySize, enemyBodyOffset,
        enemyImmovable, enemyLives, enemyInvecible, dropId);

    this.body.bounce.setTo(1,1);
    this.body.velocity.x = enemyVelocity;
};

Enemy.prototype = Object.create(Bombable.prototype);
Enemy.prototype.constructor = Enemy;


Enemy.prototype.hey = function() {console.log(this);};

Enemy.prototype.update = function() {

    this.checkFlames(); //bombable method

    this.game.physics.arcade.collide(this, this.groups.wall, logic, null, this);
    this.game.physics.arcade.collide(this, this.groups.bombable, logic, null, this);
    this.game.physics.arcade.collide(this, this.groups.bomb, logic, null, this);
    this.game.physics.arcade.collide(this, this.groups.enemy, logic, null, this);

    //atm no logic nopie
    function logic () {
        //console.log("righty")
        //this.body.velocity.x=-this.body.velocity.x;
    }
}

module.exports = Enemy;
