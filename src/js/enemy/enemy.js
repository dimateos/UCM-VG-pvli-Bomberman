'use strict';

var Bombable = require('../objects/bombable.js'); //father
var Point = require('../general/point.js');


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

    this.dir = new Point();
    this.pickDirection(); //starting the movement
    this.setSpeed(this.dir);
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
}

Enemy.prototype.logicMovement = function() {

    //virtual map pos and extra pos to cehck collisions
    var positionMap = new Point(this.position.x, this.position.y)
        .getMapSquarePos(this.tileData, enemyExtraOffset);
    var extraPosMap = new Point (this.position.x, this.position.y)
        .getMapSquareExtraPos(this.tileData, enemyExtraOffset);

    //first we check if the path is blocked
    if (this.checkCollision(positionMap, extraPosMap)) {

        this.body.velocity.x = 0; //stops the enemy
        this.body.velocity.y = 0;

        this.pickDirection(); //simple AI to change direction

        //moves the enemy (if it is not totally blocked) **may change this
        if (this.dir.x !== 0 || this.dir.y !== 0)
            this.setSpeed(this.dir);
    }
    //and then we check if some enemy is on the path
    else if (this.checkEnemyOverlap(positionMap)) {
        this.body.velocity.x *= -1; //inverts its velocity
        this.body.velocity.y *= -1;
        this.dir.multiply(-1,-1); //and dir accordingly too
    }
}

//Picks a new rnd direction (free)
Enemy.prototype.pickDirection = function() {

    var positionMap = new Point(this.position.x, this.position.y)
        .getMapSquarePos(this.tileData, enemyExtraOffset);

    var freeSurroungings = this.level.getSurroundingFreeSquares(positionMap);

    var rnd = this.game.rnd.integerInRange(0,freeSurroungings.length-1);

    // console.log(positionMap, freeSurroungings[rnd]);

    if (freeSurroungings.length === 0) this.dir = new Point();
    else this.dir = freeSurroungings[rnd];
}

//Simple method to set speed
Enemy.prototype.setSpeed = function(dir) {
    if (this.dir.x ===1) this.body.velocity.x = enemyVelocity;
    else if (this.dir.x ===-1) this.body.velocity.x = -enemyVelocity;
    else if (this.dir.y ===1) this.body.velocity.y = enemyVelocity;
    else if (this.dir.y ===-1) this.body.velocity.y = -enemyVelocity;
}

//checks if the enmy is getting closer to a block
Enemy.prototype.checkCollision = function(positionMap, extraPosMap) {
    var blocked = false;

    //checks if the next square is free and if the enemy is in the center
    if ((!this.level.isNextSquareFree(positionMap, this.dir))
    && extraPosMap.isNull()) {
        // console.log("Enemy turning");
        blocked = true;
    }

    return blocked;
}

//checks for enemies blocking the path
Enemy.prototype.checkEnemyOverlap = function(positionMap) {

    var enemyBlocking = false;
    this.game.physics.arcade.overlap(this, this.groups.enemy, checkPositions);

    return enemyBlocking;

    //only matters if the other enemy is blocking the path
    //(we do nothing if thisEnemy is the onw blocking otherEnemy)
    function checkPositions (thisEnemy, otherEnemy) {

        if (thisEnemy !== otherEnemy) { //not overlap with itself
            //console.log("Enemy overlapping");

            var otherEnemyPos = new Point(otherEnemy.position.x, otherEnemy.position.y)
                .getMapSquarePos(otherEnemy.tileData, enemyExtraOffset);

            //first calculates the next position
            var nextPos = new Point(positionMap.x, positionMap.y)
                .add(thisEnemy.dir.x, thisEnemy.dir.y)

            var positionsToCheck = getPositionsToCheck (nextPos, thisEnemy);
            // console.log(positionMap, positionsToCheck);

            for (var i = 0; i < positionsToCheck.length; i++) {

                if (positionsToCheck[i].isEqual(otherEnemyPos))
                        enemyBlocking = true;
            }
        }
    }

    //returns an array with the next dir and the diagonals
    function getPositionsToCheck (nextPos, thisEnemy) {

        var positions = [positionMap, nextPos]; //array container

        //then both diagonals
        positions.push(getDiagonal(1));
        positions.push(getDiagonal(-1));

        return positions;

        //calculates the diagonal by adding and then fixing
        function getDiagonal(parameter) {

            var diagonalDir = new Point (thisEnemy.dir.x, thisEnemy.dir.y)
                .add(parameter, parameter);

            if (diagonalDir.x%2 === 0) diagonalDir.x = 0;
            if (diagonalDir.y%2 === 0) diagonalDir.y = 0;

            return new Point(nextPos.x, nextPos.y)
                .add(diagonalDir.x, diagonalDir.y);
        }
    }

}

module.exports = Enemy;
