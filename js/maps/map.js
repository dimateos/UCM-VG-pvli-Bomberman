'use strict';

var GameObject = require('../objects/gameObject.js');
var Physical = require('../objects/physical.js');
var Bombable = require('../objects/bombable.js');
var Enemy = require('../objects/enemy.js');

var Id = require('../id/identifiable.js').Id; //for bombable id
var tierSize = require('../id/identifiable.js').tierSize; //for the rnd gen
var Portal = require('../id/portal.js'); //next level portal
var portalId = new Id(0,0); //specific id for the portal

var Point = require('../point.js');
var baseMapData = require("./baseMapData.js"); //base map and spawns
var levelsDataBase = require("./levelsDataBase.js"); //base map and spawns

//default map tiles values
var defaultBodyOffset = new Point();
var defaultImmovable = true;
var defaultBombableLives = 1;
var defaultBombableInvencibleTime = 0;
var defaultEnemyType = 0;


function Map (game, worldNum, levelNum, groups, tileData, maxPlayers) {

    this.game = game;
    this.levelData = levelsDataBase[worldNum][levelNum];

    this.maxPlayers = maxPlayers;
    //this.groups = groups; //no need to extra atributes?

    //Always same base map
    this.map = baseMapData.squares;
    this.cols = baseMapData.cols;
    this.fils = baseMapData.fils;
    this.types = baseMapData.squaresTypes;
    this.playerSpawns = baseMapData.playerSpawns;
    this.tileData = tileData;

    this.bombableIdsPowerUps = this.generateIdsPowerUps(this.levelData.powerUps);
    this.enemiesIdsPowerUps = this.generateIdsPowerUps(this.levelData.enemiesDrops);

    this.generateMap();
    this.buildMap(groups, this.tileData); //shorter with this.tileData
};


//Adds all the extra bombables and walls
Map.prototype.generateMap = function() {
    var self = this; //instead of apply
    var freeSquares = this.getFreeSquares(this.maxPlayers);

    //first generates the bombables with the drops
    var bombableDrops = this.bombableIdsPowerUps.length;
    insertRnd(bombableDrops, this.types.bombableDrop.value);
    insertRnd(this.levelData.bombables-bombableDrops, this.types.bombable.value);

    insertRnd(this.levelData.extraWalls, this.types.wall.value);

    //last the enemies, staring with the drops
    var enemiesDrops = this.enemiesIdsPowerUps.length;
    insertRnd(enemiesDrops, this.types.enemyDrop.value);
    insertRnd(this.levelData.enemies[0]-enemiesDrops, this.types.enemy.value);

    function insertRnd (numElem, type) {
        for (var i = 0; i < numElem; i++) {
            //between and including min and max (Phaser)
            var rnd = self.game.rnd.integerInRange(0,freeSquares.length-1);
            var x = freeSquares[rnd].x;
            var y = freeSquares[rnd].y;

            self.map[y][x] = type;

            //special odd wall placement to avoid wrong generation
            if (type === 1 && x%2 != 0 && y%2 != 0)
                self.removeSurroundingSquares(x,y,2,freeSquares)
            else freeSquares.splice(rnd,1); //removes from list
        }
    }
};

//gets the free squares of map excluding player pos
Map.prototype.getFreeSquares = function(maxPlayers) {
    var freeSquares = [];

    for (var i = 0; i < this.fils; i++)
        for (var j = 0; j < this.cols; j++)
            if (this.map[i][j] == 0 /*&& !checkPlayerSquare(j,i,maxPlayers)*/)
                freeSquares.push({x: j, y: i});

    //now we search and remove the players spawns and surroundings
    for (var numPlayer = 0; numPlayer < maxPlayers; numPlayer++)
        this.removeSurroundingSquares(
            this.playerSpawns[numPlayer].x, this.playerSpawns[numPlayer].y, 1, freeSquares);

    return freeSquares;

    //to compare directly instead of searching after (was my first aproach)
    //the newer implementation searches and removes, so worse case => as complex as this
    //the newer is better too because is a shared method (used in map generation)
    /*function checkPlayerSquare (x,y,maxPlayers) {
        for (var numPlayer = 0; numPlayer < maxPlayers; numPlayer++)
            if ((x == map.playerSpawns[numPlayer].x && y == map.playerSpawns[numPlayer].y)
            || (x == map.playerSpawns[numPlayer].x-1 && y == map.playerSpawns[numPlayer].y)
            || (x == map.playerSpawns[numPlayer].x+1 && y == map.playerSpawns[numPlayer].y)
            || (x == map.playerSpawns[numPlayer].x && y == map.playerSpawns[numPlayer].y-1)
            || (x == map.playerSpawns[numPlayer].x && y == map.playerSpawns[numPlayer].y+1))
                return true;
    }*/
};

//generates the array of random powerUps based on levelsDataBase info
Map.prototype.generateIdsPowerUps = function (powerUps) {

    var Ids = [];

    for (var tier = 0; tier < powerUps.length; tier++) {
        for (var n = 0; n < powerUps[tier]; n++) {
            //between and including min and max (Phaser)
            var rnd = this.game.rnd.integerInRange(0, tierSize(tier)-1);
            Ids.push(new Id(tier, rnd));
        }
    }
    //for (var i = 0; i < Ids.length; i++) console.log(Ids[i]);

    return Ids;
};

//given a free square {x: x, y: y} in a freeSquares[] and a radius
//searches and removes (real map) surroundings squares of that radius
//removes the given square too? atm yes
Map.prototype.removeSurroundingSquares = function(x, y, radius, freeSquares) {

    //Will be used with findIndex *(not supported in IE)*
    function equal (e) {
        return e.x === x_toFind
            && e.y === y_toFind;
    };

    var index; //search and store index
    var x_toFind = x, y_toFind = y; //tmp

    //first search: given square
    index = freeSquares.findIndex(equal);
    if (index > -1) freeSquares.splice(index, 1);

    //second and third searches: horizontal
    x_toFind = x - radius;
    index = freeSquares.findIndex(equal);
    if (index > -1) freeSquares.splice(index, 1);

    x_toFind = x + radius;
    index = freeSquares.findIndex(equal);
    if (index > -1) freeSquares.splice(index, 1);

    //last two: vertical (reset x required)
    x_toFind = x; y_toFind = y - radius;
    index = freeSquares.findIndex(equal);
    if (index > -1) freeSquares.splice(index, 1);

    y_toFind = y + radius;
    index = freeSquares.findIndex(equal);
    if (index > -1) freeSquares.splice(index, 1);
};

//creates all elements in their respective positions etc
Map.prototype.buildMap = function (groups, tileData) {

    for (var i = 0; i < this.cols; i++) {
        for (var j = 0; j < this.fils; j++) {

            //new point each time is bad? auto deletes trash?
            var squareIndexPos = new Point(i,j).applyTileData(tileData);
            var bombableIdPowerUp, enemyIdPowerUp;

            switch(this.map[j][i]) {

                case this.types.bombableDrop.value:
                    bombableIdPowerUp = this.bombableIdsPowerUps.pop(); //gets an Id

                case this.types.bombable.value:
                    //exception for the nextlevel portal creation -> Id tier 0 num 0
                    if (!checkPortal.call(this, tileData))
                        groups.box.add(new Bombable (this.game, this, groups, squareIndexPos,
                        this.types.bombable.sprite, tileData.Scale, tileData.Res,
                        defaultBodyOffset, defaultImmovable,
                        defaultBombableLives, defaultBombableInvencibleTime, bombableIdPowerUp));

                    bombableIdPowerUp = undefined; //resets the id

                    //no break so there is background underneath
                case this.types.free.value:
                    groups.background.add(new GameObject (this.game, squareIndexPos,
                        this.types.free.sprite, tileData.Scale));

                    break;


                case this.types.enemyDrop.value: //TODO: enemies type not based on level info
                    enemyIdPowerUp = this.enemiesIdsPowerUps.pop(); //gets an Id

                case this.types.enemy.value:
                    //adding floor too
                    groups.background.add(new GameObject (this.game, squareIndexPos,
                        this.types.free.sprite, tileData.Scale));

                    groups.enemy.add(new Enemy (this.game, squareIndexPos,
                        this, defaultEnemyType, tileData, groups, enemyIdPowerUp));

                    enemyIdPowerUp = undefined; //resets the id
                    break;


                case this.types.wallSP.value: //no special tile atm
                case this.types.wall.value:
                    groups.wall.add(new Physical (this.game, squareIndexPos,
                        this.types.wall.sprite, tileData.Scale, tileData.Res,
                        defaultBodyOffset, defaultImmovable));

                    break;
            }
        }
    }

    //checks and creates
    function checkPortal (tileData) {
        var portal = (bombableIdPowerUp !== undefined
            && bombableIdPowerUp.tier === portalId.tier
            && bombableIdPowerUp.num === portalId.num);

        if (portal) //creates the portal too
            groups.box.add(new Portal (this.game, this, groups,
            squareIndexPos, this.types.bombable.sprite, tileData,
            defaultBodyOffset, defaultImmovable,
            defaultBombableLives, defaultBombableInvencibleTime));

        return portal;
    }
};

//updates the virtual map data of a static object*
Map.prototype.updateSquare = function (position, squareType, extraOffset) {
    // console.log(position);
    // console.log(squareType);
    // console.log(extraOffset);

    //calculate the map position
    var mapPosition = new Point (position.x, position.y);
    mapPosition.reverseTileData(this.tileData, extraOffset);

    this.map[mapPosition.y][mapPosition.x] = squareType;
    // console.log(this.map);
}

//given a square position returns true if given direction is free
Map.prototype.isNextSquareFree = function (positionMap, direction) {

    var x = positionMap.x + direction.x;
    var y = positionMap.y + direction.y;

    return this.map[y][x] === this.types.free.value;
}

//given a square position returns an array of the surrounding free ones
Map.prototype.getSurroundingFreeSquares = function (positionMap) {

        var surroundings = [];
        const dirs = [new Point(1,0),new Point(-1,0),new Point(0,1),new Point(0,-1)];

        //checks all the dirs
        for (var i = 0; i < dirs.length; i++)
            if (this.isNextSquareFree(positionMap, dirs[i]))
                surroundings.push(dirs[i]);

        // console.log(surroundings);
        return surroundings;
    }

//given a square position returns true if in given direction there is not a wall
//not merged with nextPos or isNextFree because the flame expansion is partucular
Map.prototype.isNextSquareNotWall = function (positionMap, direction) {

    var x = positionMap.x + direction.x;
    var y = positionMap.y + direction.y;

    return (this.map[y][x] !== this.types.wallSP.value
        && this.map[y][x] !== this.types.wall.value);
}

module.exports = Map;
