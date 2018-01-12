'use strict';

var Bombable = require('./bombable.js'); //father
var Point = require('../point.js');


//default enemy values
var enemySpritePath = 'enemy';

var enemyBodySize = new Point(48, 48); //smaller than the sprite
var enemyBodyOffset = new Point(8, 8);
var enemyExtraOffset = new Point(0, 0); //to center it

var enemyImmovable = false;
var enemyInvecibleTime = 2500; //maybe reduce

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

    // this.body.bounce.setTo(1,1); //provisional
    // this.body.velocity.x = enemyVelocity;

    level.updateSquare(position, level.types.free.value); //clears the map

    this.pickDirection(); //starts the movement
};

Enemy.prototype = Object.create(Bombable.prototype);
Enemy.prototype.constructor = Enemy;


Enemy.prototype.update = function() {

    this.checkFlames(); //bombable method

    if (this.dead) {
        this.body.immovable = true;
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }
    else this.logicMovement();

    // else {
    //     // this.game.physics.arcade.collide(this, this.groups.wall, logic, null, this);
    //     // this.game.physics.arcade.collide(this, this.groups.box, logic, null, this);
    //     // this.game.physics.arcade.collide(this, this.groups.bomb, logic, null, this);
    //     // //not sure in the original
    //     // this.game.physics.arcade.collide(this, this.groups.enemy, logic, null, this);
    // }
}

Enemy.prototype.logicMovement = function() {

    if (this.checkCollision()) {
        this.pickDirection(); //simple AI

        //moves the enemy (if it is not blocked) **may change this
        //in enemy case the velocity is only resetted at collision
        if (this.dir.x !== 0 || this.dir.y !== 0) {
            if (this.dir.x ===1) this.body.velocity.x = enemyVelocity;
            else if (this.dir.x ===-1) this.body.velocity.x = -enemyVelocity;
            else if (this.dir.y ===1) this.body.velocity.y = enemyVelocity;
            else if (this.dir.y ===-1) this.body.velocity.y = -enemyVelocity;
        }
    }
}

//Picks a new rnd direction (free)
Enemy.prototype.pickDirection = function() {

    this.body.velocity.x = 0; //stops the enemy
    this.body.velocity.y = 0;

    var positionMap = new Point(this.position.x, this.position.y)
        .getMapSquarePos(this.tileData, enemyExtraOffset);

    var freeSurroungings = this.level.getSurroundingFreeSquares(positionMap);

    var rnd = this.game.rnd.integerInRange(0,freeSurroungings.length-1);

    // console.log(positionMap, freeSurroungings[rnd]);

    if (freeSurroungings.length === 0) this.dir = new Point();
    else this.dir = freeSurroungings[rnd];
}

//checks if the enmy is getting closer to a block
Enemy.prototype.checkCollision = function() {
    var blocked = false;

    //virtual map pos and extra pos
    var positionMap = new Point(this.position.x, this.position.y)
        .getMapSquarePos(this.tileData, enemyExtraOffset);
    var extraPosMap = new Point (this.position.x, this.position.y)
        .getMapSquareExtraPos(this.tileData, enemyExtraOffset);

    //checks if the next square is free and if the enemy is in the center
    if ((!this.level.isNextSquareFree(positionMap, this.dir))
    && (extraPosMap.x === 0 && extraPosMap.y === 0)) {
        console.log("Enemy turning");
        blocked = true;
    }

    return blocked;
}

module.exports = Enemy;
