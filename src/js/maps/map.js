'use strict';

var GameObject = require('../objects/gameObject.js');
var Physical = require('../objects/physical.js');
var Bombable = require('../objects/bombable.js');

var Point = require('../point.js');
var baseMapData = require("./baseMapData.js"); //base map and spawns


function Map (game, worldNum, levelNum, groups, tileData, maxPlayers) {

    this.game = game;
    this.worldNum = worldNum;
    this.levelNum = levelNum;

    this.maxPlayers = maxPlayers;
    //this.groups = groups; //no need to extra atributes?

    //Always same base map
    this.map = baseMapData;

    this.generateMap(6,35); //will depend on the level

    this.buildMap(groups, tileData);
};


//Adds all the extra bombables and walls
Map.prototype.generateMap = function(numWall, numBombable) {
    var self = this;
    var freeSquares = this.getFreeSquares(this.map,this.maxPlayers);

    insertRnd(numBombable, 3);
    insertRnd(numWall, 1);

    function insertRnd (numElem, type) {
        for (var i = 0; i < numElem; i++) {
            //between and including min and max (Phaser)
            var rnd = self.game.rnd.integerInRange(0,freeSquares.length-1)
            var x = freeSquares[rnd].x;
            var y = freeSquares[rnd].y;

            self.map.squares[y][x] = type;

            //special odd wall placement to avoid wrong generation
            if (type === 1 && x%2 != 0 && y%2 != 0)
                self.removeSurroundingSquares(x,y,2,freeSquares)
            else freeSquares.splice(rnd,1); //removes from list
        }
    }
};

//gets the free squares of map excluding player pos
Map.prototype.getFreeSquares = function(map, maxPlayers) {
    var freeSquares = [];

    for (var i = 0; i < map.fils; i++)
    for (var j = 0; j < map.cols; j++)
    if (map.squares[i][j] == 0 /*&& !checkPlayerSquare(j,i,maxPlayers)*/)
    freeSquares.push({x: j, y: i});

    //now we search and remove the players spawns and surroundings
    for (var numPlayer = 0; numPlayer < maxPlayers; numPlayer++)
        this.removeSurroundingSquares(
            map.playerSpawns[numPlayer].x, map.playerSpawns[numPlayer].y, 1, freeSquares);

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

    for (var i = 0; i < this.map.cols; i++) {
        for (var j = 0; j < this.map.fils; j++) {

            //new point each time is bad? auto deletes trash?
            var squareIndex = new Point(i,j).applyTileData(tileData);

            switch(this.map.squares[j][i]) {

                case 3: groups.box.add(new Bombable
                    (this.game, groups, squareIndex, 'box', tileData.Scale, tileData.Res, new Point(), true, 1, false));

                    //no break so there is background underneath

                case 0: groups.background.add(new GameObject
                    (this.game, squareIndex, 'background', tileData.Scale));

                    break;

                case 1: //no special tile for now
                case 2: groups.wall.add(new Physical
                    (this.game, squareIndex, 'wall', tileData.Scale, tileData.Res, new Point(), true));

                    break;
            }
        }
    }
};

//given a square position returns true if in given direction there is not a wall
Map.prototype.getNextSquare = function (position, direction) {

    var x = position.x + direction.x;
    var y = position.y + direction.y;

    return (this.map.squares[y][x] !== 1
        && this.map.squares[y][x] !== 2);
}


module.exports = Map;
