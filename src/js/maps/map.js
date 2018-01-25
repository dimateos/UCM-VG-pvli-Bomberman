'use strict';
const config = require('../config.js');
var GameObject = require('../objects/gameObject.js');
var Physical = require('../objects/physical.js');
var Bombable = require('../objects/bombable.js');
var Enemy = require('../enemy/enemy.js');
var Flame = require('../enemy/flame.js');

var Id = require('../id/identifiable.js').Id; //for bombable id

var Portal = require('./portal.js'); //next level portal
var portalId = new Id(0, 0); //specific id for the portal

var Point = require('../general/point.js');
var baseMapData = require("./baseMapData.js"); //base map and spawns
var levelsDataBase = require("./levelsDataBase.js"); //base map and spawns

const debugPos = config.debugMapPos;
const debugColor = config.debugColor;

//default map tiles values
var defaultBodyOffset = config.defaultBodyOffset;
var defaultImmovable = config.defaultImmovable;
var defaultBombableLives = config.defaultBombableLives;
var defaultBombableInvencibleTime = config.defaultBombableInvencibleTime;

//too import a big chunk of code
var mapCooking = require('./mapCooking.js');
var deathZoneTimeStart = config.deathZoneTimeStart;
var deathZoneTimeLoop = config.deathZoneTimeLoop;

var portalSound;

function Map(game, worldNum, levelNum, groups, tileData, maxPlayers, pvpMode) {

    this.game = game;
    this.groups = groups;
    this.tileData = tileData;
    this.maxPlayers = maxPlayers;

    this.pvpMode = pvpMode;

    this.deathZoneTimer = this.game.time.create(false);

    this.deathZoneTimerEvent = undefined;
    this.deathZoneCallback = undefined;

    //Always same base map values
    this.cols = baseMapData.cols;
    this.fils = baseMapData.fils;
    this.types = baseMapData.squaresTypes;
    this.playerSpawns = baseMapData.playerSpawns;

    if (config.endless_rnd_map_gen && !this.pvpMode) this.rndGen = 0;
    this.generateMap(worldNum, levelNum);

    if (pvpMode) this.restartDeathZoneCountdowns();
};

//only used in pvp
Map.prototype.battleRoyale = function () {

    for (var col = this.deathZoneExpansion; col < this.map[0].length - this.deathZoneExpansion; col++) {
        var squareIndexPos = new Point(col, this.deathZoneExpansion).applyTileData(this.tileData);
        this.groups.flame.add(new Flame(this.game, squareIndexPos, this.tileData.Scale));
    }
    for (var col = this.deathZoneExpansion; col < this.map[0].length - this.deathZoneExpansion; col++) {
        var squareIndexPos = new Point(col, this.map.length - 1 - this.deathZoneExpansion).applyTileData(this.tileData);
        this.groups.flame.add(new Flame(this.game, squareIndexPos, this.tileData.Scale));
    }

    for (var fil = 1 + this.deathZoneExpansion; fil < this.map.length - 1 - this.deathZoneExpansion; fil++) {
        var squareIndexPos = new Point(this.deathZoneExpansion, fil).applyTileData(this.tileData);
        this.groups.flame.add(new Flame(this.game, squareIndexPos, this.tileData.Scale));
    }

    for (var fil = 1 + this.deathZoneExpansion; fil < this.map.length - 1 - this.deathZoneExpansion; fil++) {
        var squareIndexPos = new Point(this.map[0].length - 1 - this.deathZoneExpansion, fil).applyTileData(this.tileData);
        this.groups.flame.add(new Flame(this.game, squareIndexPos, this.tileData.Scale));
    }

    this.deathZoneExpansion++;
}

//Starts the countdown to the battleRoyale mode
Map.prototype.restartDeathZoneCountdowns = function () {
    this.deathZoneExpansion = 0;
    this.deathZoneStarted = false;

    this.deathZoneTimer.stop();

    if (this.deathZoneCallback !== undefined) this.game.time.events.remove(this.deathCallback);
    if (this.deathZoneTimerEvent !== undefined) this.deathZoneTimer.remove(this.deathZoneTimerEvent);

    this.deathZoneTimerEvent = this.deathZoneTimer.add(15 * 1000, stopAndCall, this);
    this.deathZoneTimer.start();

    function stopAndCall() {
        this.deathZoneStarted = true;
        this.deathZoneTimer.stop();
        this.deathZoneExpansionFunction();
    }
}

Map.prototype.deathZoneStop = function () {
    this.deathZoneStarted = true;
    this.deathZoneTimer.stop();
    if (this.deathZoneCallback !== undefined) this.game.time.events.remove(this.deathCallback);
    if (this.deathZoneTimerEvent !== undefined) this.deathZoneTimer.removeAll();
}

Map.prototype.deathZoneExpansionFunction = function () {
    this.battleRoyale();
    this.deathZoneCallback = this.game.time.events.add(deathZoneTimeLoop, this.deathZoneExpansionFunction, this);
}

//gets data of specified map from levelsDataBase and then cooks+build
Map.prototype.generateMap = function (worldNum, levelNum) {

    this.map = baseMapData.copyMap(baseMapData.squares); //copy

    this.mapNumber = { world: worldNum, level: levelNum };

    if (config.endless_rnd_map_gen && !this.pvpMode) {
        this.levelData = baseMapData.rndGeneration(this.game, this.rndGen);
        this.rndGen++;
    }
    else this.levelData = levelsDataBase[worldNum][levelNum];

    this.bombableIdsPowerUps = this.generateIdsPowerUps(this.levelData.powerUps);
    this.enemiesIdsPowerUps = this.generateIdsPowerUps(this.levelData.enemiesDrops);
    this.enemiesTypeNumbers = this.generateEnemiesTypeNumbers(this.levelData.enemies);

    this.cookMap();
    this.buildMap(this.groups, this.tileData); //shorter with this.
}

//generates a new map (resets groups and players'positions)
Map.prototype.generateNewMap = function (worldNum, levelNum) {
    this.game.time.events.removeAll(); //required cause we are going to destry
    this.game.debug.reset(); //required cause we are going to destry
    this.groups.clearGroups(this.game); //clears all grups but player
    // console.log(this.game.time.events.events);

    this.mapNumber = { world: worldNum, level: levelNum };
    this.generateMap(worldNum, levelNum);

    this.groups.player.callAll('respawn'); //resets players' pos
    if (this.pvpMode) this.restartDeathZoneCountdowns();
};
Map.prototype.regenerateMap = function () {
    if (config.endless_rnd_map_gen && !this.pvpMode) this.rndGen--;
    this.generateNewMap(this.mapNumber.world, this.mapNumber.level);
};
Map.prototype.generateNextMap = function () { //based on number of levels in the world

    if (config.endless_rnd_map_gen) this.generateNewMap(this.mapNumber.world, this.mapNumber.level);

    else {
        if (levelsDataBase[this.mapNumber.world].length === this.mapNumber.level + 1) {
            if (levelsDataBase.length === this.mapNumber.world + 1)
                this.game.debug.text(this.mapNumber.world + " , " + this.mapNumber.level
                    + " is the last map...", debugPos.x, debugPos.y, debugColor);

            else this.generateNewMap(this.mapNumber.world + 1, 0);
        }
        else this.generateNewMap(this.mapNumber.world, this.mapNumber.level + 1);
    }
};


//Adds all the extra bombables (drop too) and walls into the map
Map.prototype.cookMap = mapCooking.cookMap;
//gets the free squares of map excluding player pos
Map.prototype.getFreeSquares = mapCooking.getFreeSquares;
//generates the array of random powerUps based on levelsDataBase info
Map.prototype.generateIdsPowerUps = mapCooking.generateIdsPowerUps;
//given a free square {x: x, y: y} in a freeSquares[] and a radius
//searches and removes (real map) surroundings squares of that radius
Map.prototype.removeSurroundingSquares = mapCooking.removeSurroundingSquares;
//generates the list of enemies based on levelsDataBase
Map.prototype.generateEnemiesTypeNumbers = mapCooking.generateEnemiesTypeNumbers;


//creates all elements in their respective positions etc
Map.prototype.buildMap = function (groups, tileData) {

    for (var i = 0; i < this.cols; i++) {
        for (var j = 0; j < this.fils; j++) {

            //new point each time is bad? auto deletes trash?
            var squareIndexPos = new Point(i, j).applyTileData(tileData);
            var bombableIdPowerUp, enemyIdPowerUp;

            switch (this.map[j][i]) {

                case this.types.bombableDrop.value:
                    bombableIdPowerUp = this.bombableIdsPowerUps.pop(); //gets an Id

                case this.types.bombable.value:
                    //exception for the nextlevel portal creation -> Id tier 0 num 0
                    if (!checkPortal.call(this, tileData))
                        groups.box.add(new Bombable(this.game, this, groups, squareIndexPos,
                            this.types.bombable.sprite, tileData.Scale, tileData.Res,
                            defaultBodyOffset, defaultImmovable,
                            defaultBombableLives, defaultBombableInvencibleTime, bombableIdPowerUp));

                    bombableIdPowerUp = undefined; //resets the id

                //no break so there is background underneath
                case this.types.free.value:
                    groups.background.add(new GameObject(this.game, squareIndexPos,
                        this.types.free.sprite, tileData.Scale));

                    break;


                case this.types.enemyDrop.value: //TODO: enemies type not based on level info
                    enemyIdPowerUp = this.enemiesIdsPowerUps.pop(); //gets an Id

                case this.types.enemy.value:
                    //adding floor too
                    groups.background.add(new GameObject(this.game, squareIndexPos,
                        this.types.free.sprite, tileData.Scale));

                    groups.enemy.add(new Enemy(this.game, squareIndexPos,
                        this, this.enemiesTypeNumbers.pop(), tileData, groups, enemyIdPowerUp));

                    enemyIdPowerUp = undefined; //resets the id
                    break;


                case this.types.wallSP.value: //no special tile atm
                case this.types.wall.value:

                    groups.wall.add(new Physical(this.game, squareIndexPos,
                        this.types.wall.sprite, tileData.Scale, tileData.Res,
                        defaultBodyOffset, defaultImmovable)); //no more needed
                    // groups.wall.add(new GameObject(this.game, squareIndexPos,
                    //     this.types.wall.sprite, tileData.Scale));

                    break;
            }
        }
    }

    //checks and creates the portal
    function checkPortal(tileData) {
        var portal = (bombableIdPowerUp !== undefined
            && bombableIdPowerUp.tier === portalId.tier
            && bombableIdPowerUp.num === portalId.num);

        if (portal) //creates the portal too
        {
            groups.box.add(new Portal(this.game, this, groups,
                squareIndexPos, this.types.bombable.sprite, tileData,
                defaultBodyOffset, defaultImmovable,
                defaultBombableLives, defaultBombableInvencibleTime));
        }

        return portal;
    }
};


//updates the virtual map data of a static object*
Map.prototype.updateSquare = function (position, squareType, extraOffset) {
    // console.log(position);
    // console.log(squareType);
    // console.log(extraOffset);

    //calculate the map position
    var mapPosition = new Point(position.x, position.y);
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
    const dirs = [new Point(1, 0), new Point(-1, 0), new Point(0, 1), new Point(0, -1)];

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
