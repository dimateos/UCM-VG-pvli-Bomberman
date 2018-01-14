'use strict';

var Point = require('../general/point.js');

var Id = require('../id/identifiable.js').Id; //for bombable id
var tierSize = require('../id/identifiable.js').tierSize; //for the rnd gen

//will be imported by the map
var mapCooking = {

//Adds all the extra bombables (drop too) and walls into the map
cookMap: function() {

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
},

//gets the free squares of map excluding player pos
getFreeSquares: function(maxPlayers) {
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
},

//generates the array of random powerUps based on levelsDataBase info
generateIdsPowerUps: function (powerUps) {

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
},

//given a free square {x: x, y: y} in a freeSquares[] and a radius
//searches and removes (real map) surroundings squares of that radius
//removes the given square too? atm yes
removeSurroundingSquares: function(x, y, radius, freeSquares) {

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
},

}

module.exports = mapCooking;
